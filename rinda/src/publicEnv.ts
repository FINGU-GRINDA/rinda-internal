import "dotenv/config";
import z from "zod";

export const PublicEnvSchema = z.object({
	NEXT_PUBLIC_BASE_URL: z
		.string()
		.url()
		.default(process.env.NEXT_PUBLIC_BASE_URL as string),
});

export const envPublic = PublicEnvSchema.parse({});
