import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { 
	checkpointFile, 
	isFileCheckpointed, 
	getCheckpointedFiles,
	clearCheckpoint,
	getCheckpointStats 
} from "./upload-qdrant";

const CHECKPOINT_FILE_PATH = path.join(__dirname, ".checkpoint.json");

const testCheckpoint = async () => {
	console.log("🧪 Testing checkpoint functionality...\n");

	try {
		// Clean up any existing checkpoint file before testing
		try {
			await fs.unlink(CHECKPOINT_FILE_PATH);
			console.log("🧹 Cleaned up existing checkpoint file\n");
		} catch {
			// File doesn't exist, that's fine
		}

		// Test 1: Initial checkpoint state
		console.log("Test 1: Testing initial checkpoint state...");
		const initialFiles = await getCheckpointedFiles();
		const initialStats = await getCheckpointStats();
		
		if (initialFiles.length === 0) {
			console.log("✅ Initial checkpoint is empty");
			console.log(`  Total files: ${initialStats.totalCheckpointed}`);
			console.log(`  Last updated: ${initialStats.lastUpdated}\n`);
		} else {
			console.log("❌ Initial checkpoint should be empty\n");
		}

		// Test 2: Checkpoint a file
		console.log("Test 2: Testing file checkpointing...");
		const testFile1 = "/home/vikyw/leads/Cambodia/Cambodia.csv";
		await checkpointFile(testFile1);
		
		const isCheckpointed1 = await isFileCheckpointed(testFile1);
		if (isCheckpointed1) {
			console.log("✅ File successfully checkpointed");
		} else {
			console.log("❌ File checkpointing failed");
		}

		// Test 3: Verify checkpoint persistence
		console.log("\nTest 3: Testing checkpoint persistence...");
		const checkpointedFiles = await getCheckpointedFiles();
		if (checkpointedFiles.includes(testFile1)) {
			console.log("✅ Checkpoint data persisted correctly");
			console.log(`  Checkpointed files: ${checkpointedFiles.length}`);
		} else {
			console.log("❌ Checkpoint data not persisted");
		}

		// Test 4: Checkpoint multiple files
		console.log("\nTest 4: Testing multiple file checkpointing...");
		const testFiles = [
			"/home/vikyw/leads/Cameroon/Cameroon.csv",
			"/home/vikyw/leads/Madagascar/Madagascar.csv",
			"/home/vikyw/leads/Albania/Albania.csv"
		];
		
		for (const file of testFiles) {
			await checkpointFile(file);
		}
		
		const allCheckpointed = await getCheckpointedFiles();
		console.log(`✅ Total checkpointed files: ${allCheckpointed.length}`);
		console.log("  Files:");
		allCheckpointed.forEach(file => {
			const relativePath = path.relative(path.join(os.homedir(), "leads"), file);
			console.log(`    - ${relativePath}`);
		});

		// Test 5: Duplicate checkpoint (should not add twice)
		console.log("\nTest 5: Testing duplicate checkpoint prevention...");
		const beforeCount = allCheckpointed.length;
		await checkpointFile(testFile1); // Try to checkpoint again
		const afterCheckpoint = await getCheckpointedFiles();
		
		if (afterCheckpoint.length === beforeCount) {
			console.log("✅ Duplicate checkpoints prevented");
		} else {
			console.log("❌ Duplicate checkpoint was added");
		}

		// Test 6: Check non-checkpointed file
		console.log("\nTest 6: Testing non-checkpointed file check...");
		const nonCheckpointedFile = "/home/vikyw/leads/Algeria/Algeria.csv";
		const isNotCheckpointed = await isFileCheckpointed(nonCheckpointedFile);
		
		if (!isNotCheckpointed) {
			console.log("✅ Non-checkpointed file correctly identified");
		} else {
			console.log("❌ Non-checkpointed file incorrectly marked as checkpointed");
		}

		// Test 7: Checkpoint statistics
		console.log("\nTest 7: Testing checkpoint statistics...");
		const stats = await getCheckpointStats();
		console.log("📊 Checkpoint Statistics:");
		console.log(`  Total checkpointed: ${stats.totalCheckpointed}`);
		console.log(`  Last updated: ${stats.lastUpdated}`);

		// Test 8: Clear checkpoint
		console.log("\nTest 8: Testing checkpoint clearing...");
		await clearCheckpoint();
		const clearedFiles = await getCheckpointedFiles();
		
		if (clearedFiles.length === 0) {
			console.log("✅ Checkpoint successfully cleared");
		} else {
			console.log("❌ Checkpoint clearing failed");
		}

		// Test 9: Verify checkpoint file exists
		console.log("\nTest 9: Verifying checkpoint file...");
		try {
			const checkpointData = await fs.readFile(CHECKPOINT_FILE_PATH, "utf-8");
			const parsed = JSON.parse(checkpointData);
			console.log("✅ Checkpoint file exists and is valid JSON");
			console.log(`  File location: ${CHECKPOINT_FILE_PATH}`);
		} catch (error) {
			console.log("❌ Checkpoint file is invalid or missing");
		}

		console.log("\n✨ All checkpoint tests completed!");

	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run tests
testCheckpoint();