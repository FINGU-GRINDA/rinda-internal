import os from "node:os";
import path from "node:path";
import { listCsvPath } from "./upload-qdrant";

const testListCsvPath = async () => {
	console.log("🧪 Testing recursive listCsvPath function...\n");

	try {
		// Test 1: List all CSV files recursively in leads folder
		console.log("Test 1: Listing all CSV files recursively in ~/leads folder...");
		const leadsPath = path.join(os.homedir(), "leads");
		const allCsvFiles = await listCsvPath({ folderPath: leadsPath });
		
		// Group files by country
		const filesByCountry = new Map<string, string[]>();
		allCsvFiles.forEach(file => {
			const relativePath = path.relative(leadsPath, file);
			const country = relativePath.split(path.sep)[0];
			if (!filesByCountry.has(country)) {
				filesByCountry.set(country, []);
			}
			filesByCountry.get(country)!.push(relativePath);
		});
		
		console.log(`Total CSV files found: ${allCsvFiles.length}`);
		console.log(`Countries with CSV files: ${filesByCountry.size}\n`);
		
		// Show summary by country (first 10)
		const sortedCountries = Array.from(filesByCountry.keys()).sort();
		console.log("Sample countries (first 10):");
		sortedCountries.slice(0, 10).forEach(country => {
			const files = filesByCountry.get(country)!;
			console.log(`  ${country}: ${files.length} CSV files`);
		});
		
		if (sortedCountries.length > 10) {
			console.log(`  ... and ${sortedCountries.length - 10} more countries`);
		}
		
		console.log("\n✅ Successfully listed all CSV files\n");

		// Test 2: Test specific country subfolder
		console.log("Test 2: Testing specific country subfolder (Cambodia)...");
		const cambodiaPath = path.join(os.homedir(), "leads", "Cambodia");
		const cambodiaCsvFiles = await listCsvPath({ folderPath: cambodiaPath });
		
		console.log(`Found ${cambodiaCsvFiles.length} CSV files in Cambodia folder:`);
		cambodiaCsvFiles.forEach(file => {
			const fileName = path.basename(file);
			console.log(`  - ${fileName}`);
		});
		console.log("✅ Successfully listed Cambodia CSV files\n");

		// Test 3: Test non-existent folder
		console.log("Test 3: Testing non-existent folder...");
		const nonExistentPath = path.join(os.homedir(), "leads", "NonExistentCountry");
		const nonExistentResult = await listCsvPath({ folderPath: nonExistentPath });
		
		if (nonExistentResult.length === 0) {
			console.log("✅ Correctly returned empty array for non-existent folder");
		} else {
			console.log("❌ Should have returned empty array for non-existent folder");
		}

		// Test 4: Test path filtering
		console.log("\nTest 4: Verifying all returned paths are CSV files...");
		const verifyPath = path.join(os.homedir(), "leads");
		const csvResults = await listCsvPath({ folderPath: verifyPath });
		const nonCsvFiles = csvResults.filter(file => !file.endsWith('.csv'));
		
		if (nonCsvFiles.length === 0) {
			console.log("✅ All returned paths have .csv extension");
		} else {
			console.log(`❌ Found ${nonCsvFiles.length} non-CSV files:`, nonCsvFiles);
		}

		// Test 5: Check full paths are returned
		console.log("\nTest 5: Verifying full paths are returned...");
		if (allCsvFiles.length > 0 && path.isAbsolute(allCsvFiles[0])) {
			console.log("✅ Full absolute paths are returned");
			console.log(`  Example: ${allCsvFiles[0]}`);
		} else if (allCsvFiles.length > 0) {
			console.log("❌ Paths are not absolute");
		}

		console.log("\n✨ All recursive listCsvPath tests completed!");

	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run tests
testListCsvPath();