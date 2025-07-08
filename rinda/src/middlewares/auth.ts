import { os } from "@orpc/server";
import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import type { User } from "@/schemas/user";

export const requiredAuthMiddleware = os
	.$context<{
		session?: {
			user: User;
			session: { id: string; expiresAt: Date; token: string; userId: string };
		} | null;
	}>()
	.middleware(async ({ context, next }) => {
		/**
		 * Why we should ?? here?
		 * Because it can avoid `getSession` being called when unnecessary.
		 * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
		 */

		const session = context.session ?? (await getSession());

		if (!session?.user) {
			throw new Error("UNAUTHORIZED");
		}

		return next({
			context: { user: session.user },
		});
	});

async function getSession() {
	const [headerList] = await Promise.all([headers(), cookies()]);

	return await auth.api.getSession({
		headers: headerList as ReadonlyHeaders,
	});
}
