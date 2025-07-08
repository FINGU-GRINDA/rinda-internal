import "dotenv/config";
import z from "zod";
import { envPublic, PublicEnvSchema } from "./publicEnv";

export const PrivateEnvSchema = z
	.object({
		QDRANT_BASE_URL: z
			.string()
			.url()
			.default(process.env.QDRANT_BASE_URL as string),
		QDRANT_API_KEY: z.string().default(process.env.QDRANT_API_KEY as string),
		JINA_API_KEY: z.string().default(process.env.JINA_API_KEY as string),
		BETTER_AUTH_SECRET: z
			.string()
			.default(process.env.BETTER_AUTH_SECRET as string),
		GOOGLE_CLIENT_ID: z
			.string()
			.default(process.env.GOOGLE_CLIENT_ID as string),
		GOOGLE_CLIENT_SECRET: z
			.string()
			.default(process.env.GOOGLE_CLIENT_SECRET as string),
	})
	.merge(PublicEnvSchema);

export const envPrivate = PrivateEnvSchema.parse(process.env);
