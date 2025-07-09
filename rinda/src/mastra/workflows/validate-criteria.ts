import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

import { validationAgent } from "../agents/validation-agent";

const validateCriteria = createStep({
	id: "validate-criteria",
	description: "Validates a given criteria",
	inputSchema: z.object({
		criteria: z.string(),
		data: z.string(),
	}),
	outputSchema: z.object({
		isValid: z.boolean(),
	}),
	execute: async (ctx) => {
		const validationResult = z.object({
			isValid: z.boolean(),
		});

		const result = await validationAgent.generate(
			[
				{
					role: "user",
					content: `Does this data meet the criteria:
## Data
${ctx.inputData.data}

## Criteria
${ctx.inputData.criteria}
`,
				},
			],
			{ output: validationResult },
		);

		return {
			isValid: result.object.isValid,
		};
	},
});

export const criteriaValidationWorkflow = createWorkflow({
	id: "criteria-validation-workflow",
	inputSchema: z.object({
		criteria: z.string(),
		data: z.string(),
	}),
	outputSchema: z.object({
		isValid: z.boolean(),
	}),
})
	.then(validateCriteria)
	.commit();
