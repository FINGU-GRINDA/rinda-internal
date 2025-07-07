import { ORPCError } from "@orpc/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { z } from "zod";
import { envPrivate } from "@/privateEnv";
import { CreatePeopleSchema, PeopleSchema } from "@/schemas/people";
import { createQueryEmbedding } from "@/services/jina-service";
import { authed } from "../orpc";

export const peopleRouter = {
	readAll: authed
		.route({
			method: "GET",
			path: "/people",
			summary: "Read all",
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

			const result = await client.search("people", {
				vector: queryEmbedding,
				limit: input.limit,
				offset: input.offset,
			});

			return result;
		}),
	createMany: authed
		.route({
			method: "POST",
			path: "/people/create-many",
			summary: "Create many",
			tags: ["People"],
		})
		.input(CreatePeopleSchema)
		.output(PeopleSchema)
		.handler(async () => {
			throw new ORPCError("Not implemented");
		}),
};
