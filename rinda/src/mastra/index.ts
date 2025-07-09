import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { validationAgent } from "./agents/validation-agent";
import { validationCriteriaAgent } from "./agents/validation-criteria-agent";
import { weatherAgent } from "./agents/weather-agent";
import { generateValidationCriteriaWorkflow } from "./workflows/generate-validation-criteria";
import { criteriaValidationWorkflow } from "./workflows/validate-criteria";

export const mastra = new Mastra({
	workflows: {
		criteriaValidationWorkflow,
		generateValidationCriteriaWorkflow,
	},
	agents: { weatherAgent, validationCriteriaAgent, validationAgent },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
});
