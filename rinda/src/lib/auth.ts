import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { envPrivate } from "@/privateEnv";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "postgresql", // or "mysql", "postgresql", ...etc
	}),
	socialProviders: {
		google: {
			clientId: envPrivate.GOOGLE_CLIENT_ID as string,
			clientSecret: envPrivate.GOOGLE_CLIENT_SECRET as string,
		},
	},
});
