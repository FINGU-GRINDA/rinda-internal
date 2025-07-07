import "dotenv/config";
import z from "zod";

export const PublicEnvSchema = z.object({
	NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3000"),
});

export const envPublic = PublicEnvSchema.parse({});
