import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { queryValidationAgent } from "./agents/query-validation-agent";
import { weatherAgent } from "./agents/weather-agent";
import { weatherWorkflow } from "./workflows/weather-workflow";

export const mastra = new Mastra({
	workflows: { weatherWorkflow },
	agents: { weatherAgent, queryValidationAgent },
	storage: new LibSQLStore({
		// stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
		url: ":memory:",
	}),
});
