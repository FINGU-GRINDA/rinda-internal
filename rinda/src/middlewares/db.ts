import { os } from "@orpc/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { envPrivate } from "@/privateEnv";

export const dbProviderMiddleware = os
	.$context<{ db?: QdrantClient }>()
	.middleware(async ({ next }) => {
		/**
		 * Why we should ?? here?
		 * Because it can avoid `createFakeDB` being called when unnecessary.
		 * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
		 */
		const db = new QdrantClient({
			apiKey: envPrivate.QDRANT_API_KEY,
			url: envPrivate.QDRANT_BASE_URL,
		});

		return next({
			context: {
				db,
			},
		});
	});
