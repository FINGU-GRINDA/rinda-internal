import { os } from "@orpc/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { envPrivate } from "@/privateEnv";
import { PrismaClient } from "../../generated/prisma";

export const dbProviderMiddleware = os
	.$context<{ qdrant?: QdrantClient; prisma?: PrismaClient }>()
	.middleware(async ({ next }) => {
		/**
		 * Why we should ?? here?
		 * Because it can avoid `createFakeDB` being called when unnecessary.
		 * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
		 */
		const qdrant = new QdrantClient({
			apiKey: envPrivate.QDRANT_API_KEY,
			url: envPrivate.QDRANT_BASE_URL,
		});

		const prisma = new PrismaClient();

		return next({
			context: {
				qdrant,
				prisma,
			},
		});
	});
