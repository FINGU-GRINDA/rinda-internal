import os from "node:os";
import path from "node:path";
import { getParsedCsvContent, generatePersonUUID } from "./upload-qdrant";

const testBatchUpload = async () => {
	console.log("🧪 Testing batch upload functionality...\n");

	try {
		// Test with a real CSV file
		const testCsvPath = path.join(os.homedir(), "leads", "Cambodia", "Cambodia.csv");
		
		console.log("Test 1: Loading and batching CSV data...");
		const people = await getParsedCsvContent({ path: testCsvPath });
		console.log(`Total records loaded: ${people.length}`);
		
		// Simulate batching
		const BATCH_SIZE = 100;
		const batches: any[][] = [];
		
		for (let i = 0; i < people.length; i += BATCH_SIZE) {
			batches.push(people.slice(i, i + BATCH_SIZE));
		}
		
		console.log(`\n✅ Data split into ${batches.length} batches:`);
		batches.forEach((batch, index) => {
			console.log(`  Batch ${index + 1}: ${batch.length} records`);
		});
		
		// Test 2: UUID generation for batches
		console.log("\nTest 2: Testing UUID generation for batches...");
		const firstBatch = batches[0];
		const uuidSet = new Set<string>();
		
		firstBatch.forEach(person => {
			const uuid = generatePersonUUID(person);
			uuidSet.add(uuid);
		});
		
		console.log(`✅ Generated ${uuidSet.size} unique UUIDs for first batch`);
		
		// Test 3: Verify batch size handling
		console.log("\nTest 3: Verifying batch size handling...");
		const lastBatch = batches[batches.length - 1];
		const expectedLastBatchSize = people.length % BATCH_SIZE || BATCH_SIZE;
		
		if (lastBatch.length === expectedLastBatchSize) {
			console.log(`✅ Last batch size correct: ${lastBatch.length} records`);
		} else {
			console.log(`❌ Last batch size incorrect: ${lastBatch.length} (expected ${expectedLastBatchSize})`);
		}
		
		// Test 4: Calculate processing statistics
		console.log("\nTest 4: Batch processing statistics...");
		const totalRecords = people.length;
		const fullBatches = Math.floor(totalRecords / BATCH_SIZE);
		const remainder = totalRecords % BATCH_SIZE;
		
		console.log(`📊 Batch Statistics:`);
		console.log(`  Total records: ${totalRecords}`);
		console.log(`  Batch size: ${BATCH_SIZE}`);
		console.log(`  Full batches: ${fullBatches}`);
		console.log(`  Last batch size: ${remainder || BATCH_SIZE}`);
		console.log(`  Total batches: ${batches.length}`);
		
		// Test 5: Simulate batch processing (without actual upload)
		console.log("\nTest 5: Simulating batch processing...");
		
		for (let i = 0; i < Math.min(3, batches.length); i++) {
			const batch = batches[i];
			console.log(`\nProcessing batch ${i + 1}:`);
			
			// Simulate UUID generation
			const batchData = batch.map(person => ({
				person,
				uuid: generatePersonUUID(person)
			}));
			
			// Show sample from batch
			const sample = batchData.slice(0, 3);
			sample.forEach((data, idx) => {
				console.log(`  Record ${idx + 1}:`);
				console.log(`    Name: ${data.person.full_name}`);
				console.log(`    UUID: ${data.uuid.substring(0, 8)}...`);
			});
			
			if (batch.length > 3) {
				console.log(`  ... and ${batch.length - 3} more records`);
			}
		}
		
		if (batches.length > 3) {
			console.log(`\n... ${batches.length - 3} more batches to process`);
		}
		
		console.log("\n✨ Batch upload test completed!");
		console.log("\nNote: This test simulates batching without actual uploads to Qdrant");

	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run test
testBatchUpload();