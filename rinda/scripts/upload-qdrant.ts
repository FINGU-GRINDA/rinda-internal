import "dotenv/config";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { QdrantClient } from "@qdrant/js-client-rest";
import { v5 as uuidV5 } from "uuid";
import z from "zod/v4";
import { processCsvInBatches } from "./process-csv-streaming";

const BATCH_SIZE = 200;
// Custom namespace for people records (must be a valid UUID)
const PEOPLE_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const COLLECTION_NAME = "people";
const CSV_PATH = path.join(os.homedir(), "leads");

const client = new QdrantClient({
	apiKey: process.env.QDRANT_API_KEY,
	url: process.env.QDRANT_BASE_URL,
});
const createCollection = async () => {
	try {
		// Check if collection exists
		const collections = await client.getCollections();
		const exists = collections.collections.some(
			(collection) => collection.name === COLLECTION_NAME,
		);

		if (!exists) {
			await client.createCollection(COLLECTION_NAME, {
				vectors: {
					size: 128,
					distance: "Cosine",
					on_disk: true,
				},
				hnsw_config: {
					m: 0,
				},
				// store payload on disk
				on_disk_payload: true,
				quantization_config: {
					scalar: {
						type: "int8",
						quantile: 0.99,
						always_ram: true,
					},
				},
			});
			console.log("Collection 'people' created successfully");
		} else {
			console.log("Collection 'people' already exists");
		}
	} catch (error) {
		console.error("Error creating collection:", error);
	}
};

const indexQdrant = async () => {
	try {
		await client.updateCollection(COLLECTION_NAME, {
			hnsw_config: {
				m: 16,
			},
		});
	} catch (error) {
		console.error("Error creating collection:", error);
	}
};

// Checkpoint file path
const CHECKPOINT_FILE_PATH = path.join(__dirname, ".checkpoint.json");

interface CheckpointData {
	uploadedFiles: string[];
	lastUpdated: string;
}

// Load checkpoint data from file
const loadCheckpoint = async (): Promise<CheckpointData> => {
	try {
		const data = await fs.readFile(CHECKPOINT_FILE_PATH, "utf-8");
		return JSON.parse(data);
	} catch (error) {
		// Return empty checkpoint if file doesn't exist
		return {
			uploadedFiles: [],
			lastUpdated: new Date().toISOString(),
		};
	}
};

// Save checkpoint data to file
const saveCheckpoint = async (data: CheckpointData): Promise<void> => {
	data.lastUpdated = new Date().toISOString();
	await fs.writeFile(CHECKPOINT_FILE_PATH, JSON.stringify(data, null, 2));
};

// Add a file to checkpoint (mark as uploaded)
export const checkpointFile = async (filePath: string): Promise<void> => {
	const checkpoint = await loadCheckpoint();

	// Add file if not already in checkpoint
	if (!checkpoint.uploadedFiles.includes(filePath)) {
		checkpoint.uploadedFiles.push(filePath);
		await saveCheckpoint(checkpoint);
		console.log(`✅ Checkpointed: ${filePath}`);
	}
};

// Check if a file has been checkpointed
export const isFileCheckpointed = async (
	filePath: string,
): Promise<boolean> => {
	const checkpoint = await loadCheckpoint();
	return checkpoint.uploadedFiles.includes(filePath);
};

// Get all checkpointed files
export const getCheckpointedFiles = async (): Promise<string[]> => {
	const checkpoint = await loadCheckpoint();
	return checkpoint.uploadedFiles;
};

// Clear checkpoint (use with caution)
export const clearCheckpoint = async (): Promise<void> => {
	await saveCheckpoint({
		uploadedFiles: [],
		lastUpdated: new Date().toISOString(),
	});
	console.log("🗑️ Checkpoint cleared");
};

// Get checkpoint statistics
export const getCheckpointStats = async (): Promise<{
	totalCheckpointed: number;
	lastUpdated: string;
}> => {
	const checkpoint = await loadCheckpoint();
	return {
		totalCheckpointed: checkpoint.uploadedFiles.length,
		lastUpdated: checkpoint.lastUpdated,
	};
};

export const listCsvPath = async (params: {
	folderPath: string;
}): Promise<string[]> => {
	const csvPaths: string[] = [];

	async function scanDirectory(dirPath: string): Promise<void> {
		try {
			const entries = await fs.readdir(dirPath, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(dirPath, entry.name);

				if (entry.isDirectory()) {
					// Recursively scan subdirectories
					await scanDirectory(fullPath);
				} else if (entry.isFile() && entry.name.endsWith(".csv")) {
					// Add CSV file paths (full paths)
					csvPaths.push(fullPath);
				}
			}
		} catch (error) {
			console.error(`Error reading directory ${dirPath}:`, error);
		}
	}

	await scanDirectory(params.folderPath);
	return csvPaths;
};

export const generatePersonUUID = (
	person: z.infer<typeof PeopleSchema>,
): string => {
	// Create a unique identifier based on key fields that shouldn't change
	// Using email as primary identifier, with fallback to name + location
	const identifier =
		person.emails ||
		`${person.full_name}:${person.location}:${person.company_name}`;
	return uuidV5(identifier.toLowerCase().trim(), PEOPLE_NAMESPACE);
};

const embedCSV = async (params: { csvPath: string }) => {
	console.log(`\n📄 Processing: ${params.csvPath}`);

	let totalBatches = 0;
	let processedRecords = 0;

	const stats = await processCsvInBatches(
		params.csvPath,
		async (batch, batchIndex) => {
			totalBatches++;
			console.log(
				`  Batch ${batchIndex + 1}: Processing ${batch.length} records...`,
			);

			try {
				// Step 1: Generate UUIDs for the batch
				const uuidStartTime = performance.now();
				const batchData = batch.map((person) => ({
					person,
					uuid: generatePersonUUID(person),
				}));
				const uuidTime = performance.now() - uuidStartTime;
				console.log(`    ⏱️  UUID generation: ${uuidTime.toFixed(2)}ms`);

				// Step 2: Create embeddings for the batch
				const embeddingStartTime = performance.now();
				const documents = batch.map((person) => JSON.stringify(person));
				const embeddings = await createDocumentEmbedding({ documents });
				const embeddingTime = performance.now() - embeddingStartTime;
				console.log(`    ⏱️  Embedding creation: ${embeddingTime.toFixed(2)}ms`);

				// Step 3: Prepare points for batch upload
				const points = batchData.map((data, index) => ({
					id: data.uuid,
					payload: data.person,
					vector: embeddings[index],
				}));

				// Step 4: Upload batch to Qdrant
				const upsertStartTime = performance.now();
				await client.upsert(COLLECTION_NAME, {
					points,
					wait: false,
				});
				const upsertTime = performance.now() - upsertStartTime;
				console.log(`    ⏱️  Qdrant upsert: ${upsertTime.toFixed(2)}ms`);

				processedRecords += batch.length;
				console.log(`    ✅ Batch ${batchIndex + 1} uploaded successfully`);
			} catch (error) {
				console.error(`    ❌ Error in batch ${batchIndex + 1}:`, error);
				throw error; // Re-throw to prevent checkpointing on error
			}
		},
		{
			batchSize: BATCH_SIZE,
			maxConcurrency: 1, // Process one batch at a time for now
			onProgress: (processed) => {
				if (processed % 10000 === 0) {
					console.log(
						`    Progress: ${processed.toLocaleString()} rows processed...`,
					);
				}
			},
		},
	);

	console.log(`  ✅ Completed: ${params.csvPath}`);
	console.log(`     Total rows: ${stats.totalRows.toLocaleString()}`);
	console.log(`     Valid rows: ${stats.validRows.toLocaleString()}`);
	console.log(
		`     Uploaded: ${processedRecords.toLocaleString()} records in ${totalBatches} batches`,
	);
};

export const PeopleSchema = z.object({
	full_name: z.string(),
	industry: z.string(),
	job_title: z.string(),
	sub_role: z.string(),
	emails: z.string(),
	mobile: z.string(),
	phone_numbers: z.string(),
	company_name: z.string(),
	company_industry: z.string(),
	company_website: z.string(),
	company_size: z.string(),
	location: z.string(),
	skills: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	birth_year: z.string(),
	birth_date: z.string(),
	gender: z.string(),
	linkedin_url: z.string(),
	facebook_url: z.string(),
	twitter_url: z.string(),
	github_url: z.string(),
	company_linkedin_url: z.string(),
	company_facebook_url: z.string(),
	company_twitter_url: z.string(),
	company_location_name: z.string(),
	company_location_street_address: z.string(),
	company_location_address_line_2: z.string(),
	company_location_postal_code: z.string(),
	location_country: z.string(),
	location_continent: z.string(),
	linkedin_connections: z.string(),
	inferred_salary: z.string(),
	years_experience: z.string(),
	countries: z.string(),
	interests: z.string(),
});

// Map CSV headers to schema keys
export const headerMapping: Record<string, keyof z.infer<typeof PeopleSchema>> =
	{
		"Full name": "full_name",
		Industry: "industry",
		"Job title": "job_title",
		"Sub Role": "sub_role",
		Emails: "emails",
		Mobile: "mobile",
		"Phone numbers": "phone_numbers",
		"Company Name": "company_name",
		"Company Industry": "company_industry",
		"Company Website": "company_website",
		"Company Size": "company_size",
		Location: "location",
		Skills: "skills",
		"First Name": "first_name",
		"Last Name": "last_name",
		"Birth Year": "birth_year",
		"Birth Date": "birth_date",
		Gender: "gender",
		"LinkedIn Url": "linkedin_url",
		"Facebook Url": "facebook_url",
		"Twitter Url": "twitter_url",
		"Github Url": "github_url",
		"Company Linkedin Url": "company_linkedin_url",
		"Company Facebook Url": "company_facebook_url",
		"Company Twitter Url": "company_twitter_url",
		"Company Location Name": "company_location_name",
		"Company Location Street Address": "company_location_street_address",
		"Company Location Address Line 2": "company_location_address_line_2",
		"Company Location Postal Code": "company_location_postal_code",
		"Location Country": "location_country",
		"Location Continent": "location_continent",
		"Linkedin Connections": "linkedin_connections",
		"Inferred Salary": "inferred_salary",
		"Years Experience": "years_experience",
		Countries: "countries",
		Interests: "interests",
	};

const createDocumentEmbedding = async (params: {
	documents: string[];
}): Promise<number[][]> => {
	const data = {
		model: "jina-embeddings-v4",
		task: "retrieval.passage",
		truncate: true,
		dimensions: 128,
		input: params.documents.map((text) => ({ text })),
	};

	try {
		const response = await fetch("https://api.jina.ai/v1/embeddings", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.JINA_API_KEY}`,
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();

		// Extract embeddings from the response and convert to Float64Array
		return result.data.map((item: { embedding: number[] }) => item.embedding);
	} catch (error) {
		console.error("Error getting embeddings:", error);
		throw error;
	}
};

const main = async () => {
	// create collection
	await createCollection();

	// list all csv files
	const csvPaths = await listCsvPath({ folderPath: CSV_PATH });

	for (const csvPath of csvPaths) {
		const isUploaded = await isFileCheckpointed(csvPath);
		if (isUploaded) {
			continue;
		}
		await embedCSV({ csvPath });

		// checkpoint
		await checkpointFile(csvPath);
	}

	// index after bulk upload
	await indexQdrant();
};

main();
