import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import csv from "csvtojson";
import { listCsvPath, PeopleSchema, headerMapping } from "./upload-qdrant";

const testSingleCsvStreaming = async (csvPath: string) => {
	const stats = await fs.stat(csvPath);
	const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
	
	return new Promise((resolve) => {
		let totalRows = 0;
		let validRows = 0;
		let invalidRows = 0;
		const startTime = Date.now();
		
		csv()
			.fromFile(csvPath)
			.subscribe(
				async (row) => {
					return new Promise<void>((resolveRow) => {
						totalRows++;
						
						try {
							const transformedRow: Record<string, string> = {};
							
							// Transform keys
							for (const [csvKey, value] of Object.entries(row)) {
								const schemaKey = headerMapping[csvKey];
								if (schemaKey) {
									transformedRow[schemaKey] = String(value || "");
								}
							}
							
							// Validate
							PeopleSchema.parse(transformedRow);
							validRows++;
						} catch {
							invalidRows++;
						}
						
						// Progress indicator
						if (totalRows % 50000 === 0) {
							process.stdout.write(`\r  Processing... ${totalRows.toLocaleString()} rows`);
						}
						
						resolveRow();
					});
				},
				(error) => {
					console.error("\n  CSV parsing error:", error);
					resolve({ totalRows, validRows, invalidRows, duration: Date.now() - startTime });
				},
				() => {
					// Clear progress line
					process.stdout.write("\r" + " ".repeat(50) + "\r");
					
					const duration = Date.now() - startTime;
					console.log(`  ✅ Processed ${totalRows.toLocaleString()} rows (${fileSizeMB} MB) in ${(duration/1000).toFixed(2)}s`);
					console.log(`     Valid: ${validRows.toLocaleString()} (${((validRows/totalRows)*100).toFixed(2)}%)`);
					console.log(`     Speed: ${Math.round(totalRows / (duration / 1000))} rows/sec`);
					
					resolve({ totalRows, validRows, invalidRows, duration });
				}
			);
	});
};

const testAllCsvFilesSimple = async () => {
	console.log("🧪 Testing CSV Parser with simple streaming...\n");

	const leadsPath = path.join(os.homedir(), "leads");

	try {
		// Get all CSV files
		console.log("Finding all CSV files...");
		const csvFiles = await listCsvPath({ folderPath: leadsPath });
		console.log(`Found ${csvFiles.length} CSV files\n`);
		
		let grandTotal = 0;
		let grandValid = 0;
		let grandInvalid = 0;
		let grandTime = 0;
		
		// Process each file one by one
		for (const [index, csvPath] of csvFiles.entries()) {
			const relativePath = path.relative(leadsPath, csvPath);
			console.log(`\n[${index + 1}/${csvFiles.length}] ${relativePath}`);
			
			try {
				const result = await testSingleCsvStreaming(csvPath) as any;
				
				grandTotal += result.totalRows;
				grandValid += result.validRows;
				grandInvalid += result.invalidRows;
				grandTime += result.duration;
				
			} catch (error) {
				console.error(`  ❌ Error: ${error}`);
			}
			
			// Summary every 50 files
			if ((index + 1) % 50 === 0 || index === csvFiles.length - 1) {
				console.log(`\n📊 Progress Summary (${index + 1}/${csvFiles.length} files):`);
				console.log(`  Total rows: ${grandTotal.toLocaleString()}`);
				console.log(`  Valid rows: ${grandValid.toLocaleString()}`);
				console.log(`  Overall speed: ${Math.round(grandTotal / (grandTime / 1000))} rows/sec`);
			}
		}
		
		// Final summary
		console.log("\n" + "=".repeat(60));
		console.log("📊 FINAL RESULTS");
		console.log("=".repeat(60));
		console.log(`Files processed: ${csvFiles.length}`);
		console.log(`Total rows: ${grandTotal.toLocaleString()}`);
		console.log(`Valid rows: ${grandValid.toLocaleString()} (${((grandValid/grandTotal)*100).toFixed(2)}%)`);
		console.log(`Invalid rows: ${grandInvalid.toLocaleString()}`);
		console.log(`Total time: ${(grandTime / 1000 / 60).toFixed(2)} minutes`);
		console.log(`Average speed: ${Math.round(grandTotal / (grandTime / 1000))} rows/second`);

		console.log("\n✨ Test completed!");

	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run the test
testAllCsvFilesSimple();