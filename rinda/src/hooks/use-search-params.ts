"use client";

import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

// Define the search params schema
const searchParamsParser = {
	q: parseAsString.withDefault(""),
	category: parseAsString.withDefault("people"),
	// Add more search params here as needed
	page: parseAsString.withDefault("1"),
	sort: parseAsString.withDefault("relevance"),
	requirements: parseAsArrayOf(parseAsString).withDefault([]),
} as const;

// Type-safe search params
export type SearchParams = {
	q: string;
	category: string;
	page: string;
	sort: string;
};

// Custom hook that provides type-safe query state management
export function useQuerySearchParams() {
	const states = useQueryStates(searchParamsParser);
	return states;
}
