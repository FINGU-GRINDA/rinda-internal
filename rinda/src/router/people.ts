import { os } from "@orpc/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import z from "zod";
import { mastra } from "@/mastra";
import { requiredAuthMiddleware } from "@/middlewares/auth";
import { envPrivate } from "@/privateEnv";
import { createQueryEmbedding } from "@/services/jina-service";

export const peopleRouter = {
	readAll: os
		.use(requiredAuthMiddleware)
		.route({
			method: "GET",
			path: "/people",
			summary: "Search people",
			tags: ["People"],
		})
		.input(
			z.object({
				query: z.string(),
				limit: z.number().int().min(1).max(100).default(10),
				offset: z.number().int().min(0).default(0),
			}),
		)
		.handler(async ({ input }) => {
			// TODO: implement search
			const client = new QdrantClient({
				apiKey: envPrivate.QDRANT_API_KEY,
				url: envPrivate.QDRANT_BASE_URL,
			});

			const queryEmbedding = await createQueryEmbedding({
				query: input.query,
			});

			const result = await client.search("peoplev2", {
				vector: queryEmbedding,
				limit: input.limit,
				offset: input.offset,
			});

			return result;
		}),
	createPresearch: os
		.use(requiredAuthMiddleware)
		.route({
			method: "POST",
			path: "/people/create-pre-search",
			summary: "Create pre-search",
			tags: ["People"],
		})
		.input(
			z.object({
				query: z.string(),
			}),
		)
		.output(z.array(z.string()))
		.handler(async ({ input }) => {
			const agent = mastra.getAgent("queryValidationAgent");
			const run = await agent.generate(
				[
					{
						role: "user",
						content: input.query,
					},
				],
				{
					output: z
						.object({
							requirements: z.array(z.string()),
						})
						.describe("Requirements"),
				},
			);
			const requirements = run.object.requirements;
			return requirements;
		}),
};
