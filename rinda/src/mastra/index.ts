import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { queryValidationAgent } from "./agents/query-validation-agent";
import { validationAgent } from "./agents/validation-agent";
import { weatherAgent } from "./agents/weather-agent";
import { weatherWorkflow } from "./workflows/weather-workflow";

export const mastra = new Mastra({
	workflows: { weatherWorkflow },
	agents: { weatherAgent, queryValidationAgent, validationAgent },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
});
