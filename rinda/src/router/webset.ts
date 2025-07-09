import { eventIterator, ORPCError, os } from "@orpc/server";
import type { InputJsonValue, JsonValue } from "@prisma/client/runtime/library";
import z from "zod";
import { db } from "@/lib/prisma";
import { requiredAuthMiddleware } from "@/middlewares/auth";
import { createQueryEmbedding, rerankDocuments } from "@/services/jina-service";
import { getQdrantClient } from "@/services/qdrant-service";
import { getRedis, subscribe } from "@/services/redis-service";

const websetRowSchema = z.object({
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	originalData: z.custom<JsonValue>().nullable(),
	validationData: z.array(z.string()),
	enrichmentData: z.array(z.string()),
	websetId: z.string().nullable(),
});

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
		.handler(async ({ input }) => {
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
			let webset = await db.webset.create({
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
			// TODO: publish webset
			// TODO: start webset query
			const redis = await getRedis();
			await redis.publish(`webset:${webset.id}`, JSON.stringify(webset));

			// create embedding
			const embedding = await createQueryEmbedding({ query: input.query });

			const qdrantClient = await getQdrantClient();
			// run webset query
			const result = await qdrantClient.search("peoplev2", {
				vector: embedding,
				limit: input.count,
			});

			const payloads = result.map((r) => r.payload);

			const rerankedPayloadsWithScore = await rerankDocuments({
				query: input.query,
				documents: payloads,
				topN: input.count,
			});

			const rerankedPayloads = rerankedPayloadsWithScore.map(
				({ document }) => document,
			);

			webset = await db.webset.update({
				where: {
					id: webset.id,
				},
				data: {
					count: rerankedPayloads.length,
					WebsetRows: {
						createMany: {
							data: rerankedPayloads.map((payload) => ({
								websetId: webset.id,
								originalData: payload as unknown as InputJsonValue,
							})),
							skipDuplicates: true,
						},
					},
				},
				include: {
					WebsetRows: true,
				},
			});

			await redis.publish(`webset:${webset.id}`, JSON.stringify(webset));

			// rerank them
			return webset;
		}),
};
