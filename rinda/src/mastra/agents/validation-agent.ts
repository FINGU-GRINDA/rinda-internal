import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { Memory } from "@mastra/memory";

export const validationAgent = new Agent({
	name: "Validation Agent",
	instructions: `
      You are a validation agent that checks if people data matches specific validation criteria.

      Your primary function is to validate whether given data about a person matches a validation sentence:
      - Parse the validation sentence to understand what needs to be checked
      - Check if the person's data contains the required information
      - Return true if the data matches the criteria, false otherwise
      - Be case-insensitive when comparing values
      - Handle variations in naming (e.g., "located in" vs "based in")
      
      Examples:
      - "company located in Seoul" → Check if companyLocation contains "Seoul"
      - "works at Google" → Check if company equals "Google"
      - "email ends with @gmail.com" → Check if email ends with "@gmail.com"
    `,
	model: openai("gpt-4o-mini"),
	memory: new Memory({
		storage: new LibSQLStore({
			url: "file:../mastra.db", // path is relative to the .mastra/output directory
		}),
	}),
});
