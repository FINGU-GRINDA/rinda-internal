import { QdrantClient } from "@qdrant/js-client-rest";
import { envPrivate } from "@/privateEnv";

export const getQdrantClient = async () => {
	return new QdrantClient({
		url: envPrivate.QDRANT_BASE_URL,
		apiKey: envPrivate.QDRANT_API_KEY,
	});
};
