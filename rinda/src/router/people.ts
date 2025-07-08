import { ORPCError } from "@orpc/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import z from "zod";
import { mastra } from "@/mastra";
import { envPrivate } from "@/privateEnv";
import { createQueryEmbedding } from "@/services/jina-service";
import { authed } from "../orpc";

export const peopleRouter = {
	readAll: authed.people.readAll.handler(async ({ input }) => {
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
	createMany: authed.people.createMany.handler(async () => {
		throw new ORPCError("Not implemented");
	}),
	createPreSearch: authed.people.createPreSearch.handler(async ({ input }) => {
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
