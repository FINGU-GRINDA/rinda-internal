import { oc } from "@orpc/contract";
import { z } from "zod";
import { CreatePeopleSchema, PeopleSchema } from "../schemas/people";

export const readAllContract = oc
	.route({
		method: "GET",
		path: "/people",
		summary: "Search people",
		tags: ["People"],
	})
	.input(
		z.object({
			query: z.string(),
			limit: z.number().int().min(1).max(100).default(10),
			offset: z.number().int().min(0).default(0),
		}),
	);

export const createManyContract = oc
	.route({
		method: "POST",
		path: "/people/create-many",
		summary: "Create many people",
		tags: ["People"],
	})
	.input(CreatePeopleSchema)
	.output(PeopleSchema);

export const createPreSearchContract = oc
	.route({
		method: "POST",
		path: "/people/create-pre-search",
		summary: "Create pre-search",
		tags: ["People"],
	})
	.input(
		z.object({
			query: z.string(),
		}),
	)
	.output(z.array(z.string()));

export const peopleContract = {
	readAll: readAllContract,
	createMany: createManyContract,
	createPreSearch: createPreSearchContract,
};
