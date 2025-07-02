import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { listCsvPath, PeopleSchema, headerMapping } from "./upload-qdrant";
import csv from "csvtojson";
import z from "zod/v4";

interface FileStats {
	file: string;
	totalRows: number;
	validRows: number;
	invalidRows: number;
	fileSize: number;
	parseTime: number;
}

const testCsvWithStreaming = async (csvPath: string): Promise<FileStats> => {
	const startTime = Date.now();
	const stats = await fs.stat(csvPath);
	const fileSize = stats.size;
	
	return new Promise((resolve) => {
		let totalRows = 0;
		let validRows = 0;
		let invalidRows = 0;
		let errorsSampled = 0;
		
		csv()
			.fromFile(csvPath)
			.subscribe(
				(row) => {
					totalRows++;
					const transformedRow: Record<string, string> = {};

					// Transform keys from CSV headers to schema keys
					for (const [csvKey, value] of Object.entries(row)) {
						const schemaKey = headerMapping[csvKey];
						if (schemaKey) {
							transformedRow[schemaKey] = String(value || "");
						}
					}

					// Validate
					try {
						PeopleSchema.parse(transformedRow);
						validRows++;
					} catch (error) {
						invalidRows++;
						if (errorsSampled < 3) {
							console.log(`    Sample error in row ${totalRows}:`, (error as any).errors?.[0]?.message || error);
							errorsSampled++;
						}
					}
					
					// Progress indicator for large files
					if (totalRows % 10000 === 0) {
						process.stdout.write(`\r    Processing... ${totalRows.toLocaleString()} rows`);
					}
				},
				(error) => {
					console.error("\n    CSV parsing error:", error);
					resolve({
						file: path.basename(csvPath),
						totalRows,
						validRows,
						invalidRows,
						fileSize,
						parseTime: Date.now() - startTime
					});
				},
				() => {
					// Clear progress line
					process.stdout.write("\r" + " ".repeat(50) + "\r");
					
					resolve({
						file: path.basename(csvPath),
						totalRows,
						validRows,
						invalidRows,
						fileSize,
						parseTime: Date.now() - startTime
					});
				}
			);
	});
};

const testAllCsvFiles = async () => {
	console.log("🧪 Testing CSV Parser with streaming (handles large files)...\n");

	const leadsPath = path.join(os.homedir(), "leads");

	try {
		// Get all CSV files
		console.log("Finding all CSV files in leads directory...");
		const csvFiles = await listCsvPath({ folderPath: leadsPath });
		console.log(`Found ${csvFiles.length} CSV files to test\n`);

		const allStats: FileStats[] = [];
		let totalSize = 0;
		let totalRows = 0;
		let totalValid = 0;
		let totalInvalid = 0;

		// Process each file
		for (const [index, csvPath] of csvFiles.entries()) {
			const relativePath = path.relative(leadsPath, csvPath);
			console.log(`\n[${index + 1}/${csvFiles.length}] Testing: ${relativePath}`);
			
			const stats = await testCsvWithStreaming(csvPath);
			allStats.push(stats);
			
			totalSize += stats.fileSize;
			totalRows += stats.totalRows;
			totalValid += stats.validRows;
			totalInvalid += stats.invalidRows;
			
			// Display results
			console.log(`  ✅ Rows: ${stats.totalRows.toLocaleString()}`);
			console.log(`     Valid: ${stats.validRows.toLocaleString()} (${((stats.validRows/stats.totalRows)*100).toFixed(2)}%)`);
			console.log(`     Invalid: ${stats.invalidRows.toLocaleString()}`);
			console.log(`     Size: ${(stats.fileSize / 1024 / 1024).toFixed(2)} MB`);
			console.log(`     Time: ${(stats.parseTime / 1000).toFixed(2)}s`);
			console.log(`     Speed: ${((stats.totalRows / stats.parseTime) * 1000).toFixed(0)} rows/sec`);
			
			// Show progress every 10 files
			if ((index + 1) % 10 === 0) {
				console.log(`\n📊 Progress: ${index + 1}/${csvFiles.length} files processed`);
				console.log(`   Total rows so far: ${totalRows.toLocaleString()}`);
			}
		}

		// Final statistics
		console.log("\n\n" + "=".repeat(60));
		console.log("📊 FINAL STATISTICS");
		console.log("=".repeat(60));
		console.log(`Total CSV files: ${csvFiles.length}`);
		console.log(`Total size: ${(totalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
		console.log(`Total rows: ${totalRows.toLocaleString()}`);
		console.log(`Valid rows: ${totalValid.toLocaleString()} (${((totalValid/totalRows)*100).toFixed(2)}%)`);
		console.log(`Invalid rows: ${totalInvalid.toLocaleString()} (${((totalInvalid/totalRows)*100).toFixed(2)}%)`);
		
		// Top 10 largest files by row count
		console.log("\n🏆 Top 10 Largest Files (by rows):");
		allStats
			.sort((a, b) => b.totalRows - a.totalRows)
			.slice(0, 10)
			.forEach((stat, index) => {
				console.log(`  ${index + 1}. ${stat.file}: ${stat.totalRows.toLocaleString()} rows (${(stat.fileSize / 1024 / 1024).toFixed(2)} MB)`);
			});
		
		// Performance summary
		const totalTime = allStats.reduce((sum, stat) => sum + stat.parseTime, 0);
		console.log("\n⚡ Performance Summary:");
		console.log(`  Total parse time: ${(totalTime / 1000 / 60).toFixed(2)} minutes`);
		console.log(`  Average speed: ${((totalRows / totalTime) * 1000).toFixed(0)} rows/second`);
		console.log(`  Files processed per minute: ${(csvFiles.length / (totalTime / 1000 / 60)).toFixed(1)}`);

		console.log("\n✨ All CSV parser tests completed successfully!");

	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run the test
testAllCsvFiles();