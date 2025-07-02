import os from "node:os";
import path from "node:path";
import { testStreamingProcessor } from "./process-csv-streaming";
import { listCsvPath } from "./upload-qdrant";

const testAllCsvFilesStreaming = async () => {
	console.log(
		"🧪 Testing CSV Parser with streaming on all files in ~/leads...\n",
	);

	const leadsPath = path.join(os.homedir(), "leads");

	try {
		// Get all CSV files
		console.log("Finding all CSV files in leads directory...");
		const csvFiles = await listCsvPath({ folderPath: leadsPath });
		console.log(`Found ${csvFiles.length} CSV files to test\n`);

		let totalRows = 0;
		let totalValid = 0;
		let totalInvalid = 0;
		let totalTime = 0;
		const results: any[] = [];

		// Process each file with streaming
		for (const [index, csvPath] of csvFiles.entries()) {
			const relativePath = path.relative(leadsPath, csvPath);
			console.log(
				`\n[${index + 1}/${csvFiles.length}] Testing: ${relativePath}`,
			);

			try {
				const startTime = Date.now();
				const stats = await testStreamingProcessor(csvPath);
				const duration = Date.now() - startTime;

				totalRows += stats.totalRows;
				totalValid += stats.validRows;
				totalInvalid += stats.invalidRows;
				totalTime += duration;

				results.push({
					file: relativePath,
					...stats,
					duration,
				});
			} catch (error) {
				console.error(`  ❌ Failed to process: ${error}`);
				results.push({
					file: relativePath,
					totalRows: 0,
					validRows: 0,
					invalidRows: 0,
					duration: 0,
					error: true,
				});
			}

			// Show progress every 10 files
			if ((index + 1) % 10 === 0) {
				console.log(
					`\n📊 Overall Progress: ${index + 1}/${csvFiles.length} files`,
				);
				console.log(`   Total rows processed: ${totalRows.toLocaleString()}`);
				console.log(
					`   Processing speed: ${Math.round(totalRows / (totalTime / 1000))} rows/sec`,
				);
			}
		}

		// Final summary
		console.log(`\n\n${"=".repeat(60)}`);
		console.log("📊 FINAL STATISTICS");
		console.log("=".repeat(60));
		console.log(`Total CSV files processed: ${csvFiles.length}`);
		console.log(`Total rows: ${totalRows.toLocaleString()}`);
		console.log(
			`Valid rows: ${totalValid.toLocaleString()} (${((totalValid / totalRows) * 100).toFixed(2)}%)`,
		);
		console.log(
			`Invalid rows: ${totalInvalid.toLocaleString()} (${((totalInvalid / totalRows) * 100).toFixed(2)}%)`,
		);

		// Top 10 largest files
		console.log("\n🏆 Top 10 Largest Files:");
		results
			.filter((r) => !r.error)
			.sort((a, b) => b.totalRows - a.totalRows)
			.slice(0, 10)
			.forEach((stat, index) => {
				console.log(
					`  ${index + 1}. ${stat.file}: ${stat.totalRows.toLocaleString()} rows`,
				);
			});

		// Files with errors
		const errorFiles = results.filter((r) => r.error);
		if (errorFiles.length > 0) {
			console.log(`\n❌ Files with errors: ${errorFiles.length}`);
			errorFiles.forEach((f) => console.log(`  - ${f.file}`));
		}

		// Performance
		console.log("\n⚡ Performance:");
		console.log(
			`  Total processing time: ${(totalTime / 1000 / 60).toFixed(2)} minutes`,
		);
		console.log(
			`  Average speed: ${Math.round(totalRows / (totalTime / 1000))} rows/second`,
		);
		console.log(
			`  Files per minute: ${(csvFiles.length / (totalTime / 1000 / 60)).toFixed(1)}`,
		);

		console.log("\n✨ All streaming CSV parser tests completed!");
	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run the test
testAllCsvFilesStreaming();
