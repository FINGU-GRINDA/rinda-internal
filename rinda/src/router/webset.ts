import { eventIterator, ORPCError, os } from "@orpc/server";
import type { InputJsonValue, JsonValue } from "@prisma/client/runtime/library";
import z from "zod";
import { db } from "@/lib/prisma";
import { mastra } from "@/mastra";
import { requiredAuthMiddleware } from "@/middlewares/auth";
import { createQueryEmbedding, rerankDocuments } from "@/services/jina-service";
import { getQdrantClient } from "@/services/qdrant-service";
import { getRedis, subscribe } from "@/services/redis-service";
import { ValidationStatus } from "../../generated/prisma";

const websetRowSchema = z.object({
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	originalData: z.custom<JsonValue>().nullable(),
	validationData: z.array(z.enum(["VALID", "INVALID", "PENDING"])),
	enrichmentData: z.array(z.string()),
	websetId: z.string().nullable(),
});

async function processWebsetInBackground(
	websetId: string,
	input: { query: string; validationCriterias: string[]; count: number },
) {
	try {
		const redis = await getRedis();

		// create embedding
		const embedding = await createQueryEmbedding({ query: input.query });

		const qdrantClient = await getQdrantClient();
		// run webset query
		const result = await qdrantClient.search("peoplev2", {
			vector: embedding,
			limit: 100,
		});

		const payloads = result.map((r) => r.payload);

		const rerankedPayloadsWithScore = await rerankDocuments({
			query: input.query,
			documents: payloads,
		});

		const rerankedPayloads = rerankedPayloadsWithScore.map(
			({ document }) => document,
		);

		await db.websetRow.createMany({
			data: rerankedPayloads.map((payload) => ({
				websetId: websetId,
				originalData: payload as unknown as InputJsonValue,
				validationData: Array(input.validationCriterias.length).fill(
					ValidationStatus.PENDING,
				),
			})),
			skipDuplicates: true,
		});

		const webset = await db.webset.update({
			where: {
				id: websetId,
			},
			data: {
				count: input.count,
			},
			include: {
				WebsetRows: true,
			},
		});

		await redis.publish(`webset:${websetId}`, JSON.stringify(webset));

		// TODO: validate each webset row
		// for await (const websetRow of webset.WebsetRows) {
		// }
	} catch (error) {
		console.error("Error processing webset in background:", error);
	}
}

export const websetRouter = {
	liveQuery: os
		.use(requiredAuthMiddleware)
		.route({
			method: "POST",
			path: "/webset/live-query",
			summary: "Live query",
			tags: ["Webset"],
		})
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.output(
			eventIterator(
				z.object({
					id: z.string(),
					createdAt: z.date(),
					updatedAt: z.date(),
					searchQuery: z.string(),
					validationCriterias: z.array(z.string()),
					enrichmentCriterias: z.array(z.string()),
					WebsetRows: z.array(websetRowSchema),
					count: z.number(),
					createdByuserId: z.string(),
				}),
			),
		)
		.handler(async function* ({ input }) {
			try {
				const webset = await db.webset.findUnique({
					where: {
						id: input.id,
					},
					include: {
						WebsetRows: true,
					},
				});

				if (!webset) {
					throw new ORPCError("Webset not found");
				}

				yield webset;

				// Subscribe to Redis updates for this webset
				for await (const message of subscribe<typeof webset>(
					`webset:${webset.id}`,
				)) {
					yield message;
				}
			} catch (error) {
				console.error("Error processing webset in background:", error);
			} finally {
				console.log("Done processing webset in background");
			}
		}),
	update: os
		.use(requiredAuthMiddleware)
		.route({
			method: "PATCH",
			path: "/webset",
			summary: "Update",
			tags: ["Webset"],
		})
		.input(
			z.object({
				id: z.string(),
				enrichmentCriterias: z.array(z.string()).optional(),
				validationCriterias: z.array(z.string()).optional(),
				count: z.number().int().min(1).max(500).default(10),
			}),
		)
		.handler(async ({ input: _input }) => {
			throw new ORPCError("Not implemented");
		}),
	create: os
		.use(requiredAuthMiddleware)
		.route({
			method: "POST",
			path: "/webset",
			summary: "Create",
			tags: ["Webset"],
		})
		.input(
			z.object({
				query: z.string(),
				validationCriterias: z.array(z.string()),
				enrichmentCriterias: z.array(z.string()),
				count: z.number().int().min(1).max(500).default(10),
			}),
		)
		.handler(async ({ input, context }) => {
			const webset = await db.webset.create({
				data: {
					searchQuery: input.query,
					validationCriterias: input.validationCriterias,
					enrichmentCriterias: input.enrichmentCriterias,
					count: input.count,
					createdByuserId: context.user.id,
				},
				include: {
					WebsetRows: true,
				},
			});

			const redis = await getRedis();
			await redis.publish(`webset:${webset.id}`, JSON.stringify(webset));

			// Run background processing without blocking response
			processWebsetInBackground(webset.id, input).catch(console.error);

			return webset;
		}),
	createPresearch: os
		.use(requiredAuthMiddleware)
		.route({
			method: "POST",
			path: "/webset/create-pre-search",
			summary: "Create pre-search",
			tags: ["Webset"],
		})
		.input(
			z.object({
				query: z.string(),
			}),
		)
		.output(z.array(z.string()))
		.handler(async ({ input }) => {
			const run = await mastra
				.getWorkflow("generateValidationCriteriaWorkflow")
				.createRunAsync();
			const result = await run.start({
				inputData: {
					query: input.query,
				},
			});
			if (result.status !== "success") {
				throw new Error("Failed to create pre-search");
			}
			return result.result.criterias;
		}),
	readAll: os
		.use(requiredAuthMiddleware)
		.route({
			method: "GET",
			path: "/webset",
			summary: "Read all",
			tags: ["Webset"],
		})
		.handler(async (ctx) => {
			const websets = await db.webset.findMany({
				where: {
					createdByuserId: ctx.context.user.id,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			return websets;
		}),
	previewSearch: os
		.use(requiredAuthMiddleware)
		.route({
			method: "POST",
			path: "/webset/preview-search",
			summary: "Preview search",
			tags: ["Webset"],
		})
		.input(
			z.object({
				query: z.string(),
				count: z.number().int().min(1).max(10).default(10),
			}),
		)
		.handler(async ({ input }) => {
			const embedding = await createQueryEmbedding({ query: input.query });

			const qdrantClient = await getQdrantClient();
			// run webset query
			const result = await qdrantClient.search("peoplev2", {
				vector: embedding,
				limit: input.count,
			});

			const payloads = result.map((r) => r.payload);

			return payloads;
		}),
};
