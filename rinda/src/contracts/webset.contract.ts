import { eventIterator, oc } from "@orpc/contract";
import { z } from "zod";

const websetRowSchema = z.object({
	id: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	originalData: z.record(z.string(), z.string()),
	validationData: z.array(z.boolean()),
	enrichmentData: z.array(z.string()),
	websetId: z.string().nullable(),
});

export const websetContract = {
	create: oc
		.route({
			method: "POST",
			path: "/webset",
			summary: "Create",
			tags: ["Webset"],
		})
		.input(
			z.object({
				query: z.string(),
				validationCriterias: z.array(z.string()),
				enrichmentCriterias: z.array(z.string()),
				count: z.number().int().min(1).max(500).default(10),
			}),
		),
	liveQuery: oc
		.route({
			method: "POST",
			path: "/webset/live-query",
			summary: "Live query",
			tags: ["Webset"],
		})
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.output(
			eventIterator(
				z.object({
					id: z.string(),
					createdAt: z.date(),
					updatedAt: z.date(),
					searchQuery: z.string(),
					validationCriterias: z.array(z.string()),
					enrichmentCriterias: z.array(z.string()),
					rows: z.array(websetRowSchema),
					count: z.number(),
					createdByUserId: z.string(),
				}),
			),
		),
	update: oc
		.route({
			method: "PATCH",
			path: "/webset",
			summary: "Update",
			tags: ["Webset"],
		})
		.input(
			z.object({
				id: z.string(),
				enrichmentCriterias: z.array(z.string()).optional(),
				validationCriterias: z.array(z.string()).optional(),
				count: z.number().int().min(1).max(500).default(10),
			}),
		),
};
