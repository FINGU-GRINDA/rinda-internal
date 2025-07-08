import { ORPCError } from "@orpc/server";
import { db } from "@/lib/prisma";
import { authed } from "../orpc";

export const websetRouter = {
	liveQuery: authed.webset.liveQuery.handler(async ({ input }) => {
		throw new ORPCError("Not implemented");
	}),
	update: authed.webset.update.handler(async ({ input }) => {
		throw new ORPCError("Not implemented");
	}),
	create: authed.webset.create.handler(async ({ input }) => {
		const webset = await db.webset.create({
			data: {
				searchQuery: input.query,
				validationCriterias: input.validationCriterias,
				enrichmentCriterias: input.enrichmentCriterias,
				count: input.count,
				createdByuserId: "",
			},
		});
	}),
};
