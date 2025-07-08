"use client";

import {
	parseAsArrayOf,
	parseAsBoolean,
	parseAsString,
	useQueryStates,
} from "nuqs";

// Define the search params schema
const searchParamsParser = {
	q: parseAsString.withDefault(""),
	category: parseAsString.withDefault("people"),
	// Add more search params here as needed
	page: parseAsString.withDefault("1"),
	sort: parseAsString.withDefault("relevance"),
	// Generated criteria from API (persisted in URL)
	generatedCriteria: parseAsArrayOf(parseAsString).withDefault([]),
	// Flag to track if API data has been processed (prevents re-processing)
	hasProcessedApiData: parseAsBoolean.withDefault(false),
	// Custom criteria with color information (format: "text|color")
	customCriteria: parseAsArrayOf(parseAsString).withDefault([]),
} as const;

// Type-safe search params
export type SearchParams = {
	q: string;
	category: string;
	page: string;
	sort: string;
	generatedCriteria: string[];
	hasProcessedApiData: boolean;
	customCriteria: string[];
};

// Custom hook that provides type-safe query state management
export function useQuerySearchParams() {
	const states = useQueryStates(searchParamsParser);
	return states;
}
