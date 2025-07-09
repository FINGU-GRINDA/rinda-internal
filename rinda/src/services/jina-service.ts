import pRetry from "p-retry";
import { z } from "zod";
import { envPrivate } from "@/privateEnv";

export const JinaResponseSchema = z.object({
	model: z.string(),
	object: z.string(),
	usage: z.object({ total_tokens: z.number() }),
	data: z.array(
		z.object({
			object: z.string(),
			index: z.number(),
			embedding: z.array(z.number()),
		}),
	),
});

export const createDocumentEmbedding = async (params: {
	documents: string[];
}): Promise<number[][]> => {
	const data = {
		model: "jina-embeddings-v4",
		task: "retrieval.passage",
		truncate: true,
		dimensions: 128,
		input: params.documents.map((text) => ({ text })),
	};

	return pRetry(
		async () => {
			const response = await fetch("https://api.jina.ai/v1/embeddings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${envPrivate.JINA_API_KEY}`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			const parsedResult = JinaResponseSchema.parse(result);

			// Extract embeddings from the response and convert to Float64Array
			return parsedResult.data.map((item) => item.embedding);
		},
		{
			onFailedAttempt: (error) => {
				console.error(
					`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
				);
			},
		},
	);
};

export const createQueryEmbedding = async (params: {
	query: string;
}): Promise<number[]> => {
	const data = {
		model: "jina-embeddings-v4",
		task: "retrieval.query",
		truncate: true,
		dimensions: 128,
		input: [{ text: params.query }],
	};

	return pRetry(
		async () => {
			const response = await fetch("https://api.jina.ai/v1/embeddings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${envPrivate.JINA_API_KEY}`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			const parsedResult = JinaResponseSchema.parse(result);

			// Extract embeddings from the response
			return parsedResult.data.map((item) => item.embedding)[0];
		},
		{
			onFailedAttempt: (error) => {
				console.error(
					`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
				);
			},
		},
	);
};

const RerankResponseSchema = z.object({
	model: z.string(),
	usage: z.object({ total_tokens: z.number() }),
	results: z.array(
		z.object({
			index: z.number(),
			relevance_score: z.number(),
		}),
	),
});

export const rerankDocuments = async <T>(params: {
	query: string;
	documents: T[];
	topN?: number;
}): Promise<Array<{ document: T; score: number }>> => {
	const data = {
		model: "jina-reranker-m0",
		query: params.query,
		top_n: params.topN || 100,
		documents: params.documents.map((doc) => ({ text: JSON.stringify(doc) })),
		return_documents: false,
	};

	return pRetry(
		async () => {
			const response = await fetch("https://api.jina.ai/v1/rerank", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${envPrivate.JINA_API_KEY}`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			const parsedResult = RerankResponseSchema.parse(result);

			return parsedResult.results.map((result) => ({
				document: params.documents[result.index],
				score: result.relevance_score,
			}));
		},
		{
			onFailedAttempt: (error) => {
				console.error(
					`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
				);
			},
		},
	);
};
