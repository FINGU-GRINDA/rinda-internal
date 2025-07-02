import csv from "csvtojson";
import type z from "zod/v4";
import {
	generatePersonUUID,
	headerMapping,
	PeopleSchema,
} from "./upload-qdrant";

export type ProcessBatchCallback = (
	batch: z.infer<typeof PeopleSchema>[],
	batchIndex: number,
) => Promise<void>;

export interface StreamingOptions {
	batchSize?: number;
	onProgress?: (processed: number, total?: number) => void;
	maxConcurrency?: number;
}

export const processCsvInBatches = async (
	csvPath: string,
	processBatch: ProcessBatchCallback,
	options: StreamingOptions = {},
): Promise<{ totalRows: number; validRows: number; invalidRows: number }> => {
	const { batchSize = 100, onProgress, maxConcurrency = 1 } = options;

	let currentBatch: z.infer<typeof PeopleSchema>[] = [];
	let batchIndex = 0;
	let totalRows = 0;
	let validRows = 0;
	let invalidRows = 0;
	let errorsSampled = 0;

	// Queue to control concurrent batch processing
	const processingQueue: Promise<void>[] = [];

	const flushBatch = async () => {
		if (currentBatch.length === 0) return;

		const batchToProcess = [...currentBatch];
		const currentBatchIndex = batchIndex++;
		currentBatch = [];

		// Process batch immediately without queuing if no concurrency
		if (maxConcurrency === 1) {
			await processBatch(batchToProcess, currentBatchIndex).catch((error) => {
				console.error(`Error processing batch ${currentBatchIndex}:`, error);
				throw error;
			});
			return;
		}

		// Handle concurrent processing
		while (processingQueue.length >= maxConcurrency) {
			await Promise.race(processingQueue);
			// Remove completed promises
			processingQueue.splice(
				0,
				processingQueue.length,
				...processingQueue.filter((p) =>
					p
						.then(
							() => false,
							() => false,
						)
						.then((pending) => pending !== false),
				),
			);
		}

		// Process batch
		const batchPromise = processBatch(batchToProcess, currentBatchIndex).catch(
			(error) => {
				console.error(`Error processing batch ${currentBatchIndex}:`, error);
				throw error;
			},
		);

		processingQueue.push(batchPromise);
	};

	return new Promise((resolve, reject) => {
		csv()
			.fromFile(csvPath)
			.subscribe(
				async (row) => {
					return new Promise<void>((resolveRow) => {
						totalRows++;

						try {
							const transformedRow: Record<string, string | null> = {};

							// Transform keys from CSV headers to schema keys
							for (const [csvKey, value] of Object.entries(row)) {
								const schemaKey = headerMapping[csvKey];
								if (schemaKey) {
									// Convert empty strings to null, otherwise keep as string
									const stringValue = value != null ? String(value) : null;
									transformedRow[schemaKey] =
										stringValue === "" ? null : stringValue;
								}
							}

							// Validate
							const validatedObj = PeopleSchema.parse(transformedRow);
							validRows++;

							// Add to current batch
							currentBatch.push(validatedObj);

							// Flush batch if it's full
							if (currentBatch.length >= batchSize) {
								flushBatch().then(
									() => resolveRow(),
									(error) => {
										console.error("Error flushing batch:", error);
										resolveRow(); // Continue processing despite error
									},
								);
							} else {
								resolveRow();
							}
						} catch (error) {
							invalidRows++;
							if (errorsSampled < 3) {
								console.error(`Error parsing row ${totalRows}:`, error);
								errorsSampled++;
							}
							resolveRow();
						}

						// Report progress
						if (onProgress && totalRows % 1000 === 0) {
							onProgress(totalRows);
						}
					});
				},
				(error) => {
					console.error("CSV streaming error:", error);
					reject(error);
				},
				async () => {
					try {
						// Process final batch
						await flushBatch();

						// Wait for all batches to complete
						await Promise.all(processingQueue);

						resolve({ totalRows, validRows, invalidRows });
					} catch (error) {
						reject(error);
					}
				},
			);
	});
};

// Example usage for testing
export const testStreamingProcessor = async (csvPath: string) => {
	console.log(`\n📄 Processing: ${csvPath}`);

	let processedBatches = 0;
	const startTime = Date.now();

	const stats = await processCsvInBatches(
		csvPath,
		async (batch, batchIndex) => {
			// Simulate processing (e.g., generating UUIDs, creating embeddings, uploading)
			console.log(
				`  Processing batch ${batchIndex + 1}: ${batch.length} records`,
			);

			// Generate UUIDs for the batch (just for testing deduplication)
			batch.forEach((person) => generatePersonUUID(person));

			// Simulate some async work
			await new Promise((resolve) => setTimeout(resolve, 10));

			processedBatches++;
		},
		{
			batchSize: 100,
			maxConcurrency: 3,
			onProgress: (processed) => {
				if (processed % 10000 === 0) {
					console.log(
						`  Progress: ${processed.toLocaleString()} rows processed...`,
					);
				}
			},
		},
	);

	const duration = Date.now() - startTime;
	console.log(`\n✅ Completed processing ${csvPath}`);
	console.log(`  Total rows: ${stats.totalRows.toLocaleString()}`);
	console.log(`  Valid rows: ${stats.validRows.toLocaleString()}`);
	console.log(`  Invalid rows: ${stats.invalidRows.toLocaleString()}`);
	console.log(`  Batches processed: ${processedBatches}`);
	console.log(`  Duration: ${(duration / 1000).toFixed(2)}s`);
	console.log(
		`  Speed: ${Math.round(stats.totalRows / (duration / 1000))} rows/sec`,
	);

	return stats;
};
