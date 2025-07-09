import { createStep, createWorkflow } from "@mastra/core";
import z from "zod";
import { validationCriteriaAgent } from "../agents/validation-criteria-agent";

const generateValidationCriteria = createStep({
	id: "generate-validation-criteria",
	description: "Generates a validation criteria",
	inputSchema: z.object({
		query: z.string(),
	}),
	outputSchema: z.object({
		criterias: z.array(z.string()),
	}),
	execute: async (ctx) => {
		const criteria = await validationCriteriaAgent.generate(
			[
				{
					role: "user",
					content: "Generate a validation criteria for a search query.",
				},
			],
			{ output: z.object({ criterias: z.array(z.string()) }) },
		);
		return {
			criterias: criteria.object.criterias,
		};
	},
});

export const generateValidationCriteriaWorkflow = createWorkflow({
	id: "generate-validation-criteria-workflow",
	inputSchema: z.object({
		query: z.string(),
	}),
	outputSchema: z.object({
		criterias: z.array(z.string()),
	}),
})
	.then(generateValidationCriteria)
	.commit();
