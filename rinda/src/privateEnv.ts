import "dotenv/config";
import z from "zod";
import { PublicEnvSchema } from "./publicEnv";

export const PrivateEnvSchema = PublicEnvSchema.extend({
	QDRANT_BASE_URL: z
		.string()
		.url()
		.default(process.env.QDRANT_BASE_URL as string),
	QDRANT_API_KEY: z.string().default(process.env.QDRANT_API_KEY as string),
	JINA_API_KEY: z.string().default(process.env.JINA_API_KEY as string),
});

export const envPrivate = PrivateEnvSchema.parse({});
