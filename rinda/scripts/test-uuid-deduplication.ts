import os from "node:os";
import path from "node:path";
import type { z } from "zod/v4";
import { processCsvInBatches } from "./process-csv-streaming";
import { generatePersonUUID, type PeopleSchema } from "./upload-qdrant";

const testUUIDDeduplication = async () => {
	console.log("🧪 Testing UUID Deduplication...\n");

	try {
		// Test 1: Same person should generate same UUID
		console.log("Test 1: Testing UUID consistency for same person...");
		const testPerson = {
			full_name: "John Doe",
			industry: "Technology",
			job_title: "Software Engineer",
			sub_role: "",
			emails: "john.doe@example.com",
			mobile: "",
			phone_numbers: "",
			company_name: "Tech Corp",
			company_industry: "Technology",
			company_website: "https://techcorp.com",
			company_size: "100-500",
			location: "San Francisco",
			skills: "",
			first_name: "John",
			last_name: "Doe",
			birth_year: "",
			birth_date: "",
			gender: "",
			linkedin_url: "",
			facebook_url: "",
			twitter_url: "",
			github_url: "",
			company_linkedin_url: "",
			company_facebook_url: "",
			company_twitter_url: "",
			company_location_name: "",
			company_location_street_address: "",
			company_location_address_line_2: "",
			company_location_postal_code: "",
			location_country: "USA",
			location_continent: "North America",
			linkedin_connections: "",
			inferred_salary: "",
			years_experience: "",
			countries: "USA",
			interests: "",
		};

		const uuid1 = generatePersonUUID(testPerson);
		const uuid2 = generatePersonUUID(testPerson);

		if (uuid1 === uuid2) {
			console.log(`✅ Same person generates same UUID: ${uuid1}\n`);
		} else {
			console.log(
				`❌ Same person generated different UUIDs: ${uuid1} vs ${uuid2}\n`,
			);
		}

		// Test 2: Email-based UUID generation
		console.log("Test 2: Testing email-based UUID generation...");
		const personWithEmail = { ...testPerson, emails: "unique@example.com" };
		const personWithSameEmail = {
			...testPerson,
			full_name: "Different Name",
			emails: "unique@example.com",
		};

		const uuidEmail1 = generatePersonUUID(personWithEmail);
		const uuidEmail2 = generatePersonUUID(personWithSameEmail);

		if (uuidEmail1 === uuidEmail2) {
			console.log(`✅ Same email generates same UUID regardless of name\n`);
		} else {
			console.log(`❌ Same email generated different UUIDs\n`);
		}

		// Test 3: Fallback to name+location+company when no email
		console.log("Test 3: Testing fallback identifier (no email)...");
		const personNoEmail = { ...testPerson, emails: "" };
		const personNoEmailCopy = { ...testPerson, emails: "" };

		const uuidNoEmail1 = generatePersonUUID(personNoEmail);
		const uuidNoEmail2 = generatePersonUUID(personNoEmailCopy);

		if (uuidNoEmail1 === uuidNoEmail2) {
			console.log(`✅ Same name+location+company generates same UUID\n`);
		} else {
			console.log(`❌ Same name+location+company generated different UUIDs\n`);
		}

		// Test 4: Different persons generate different UUIDs
		console.log(
			"Test 4: Testing different persons generate different UUIDs...",
		);
		const person1 = { ...testPerson, emails: "person1@example.com" };
		const person2 = { ...testPerson, emails: "person2@example.com" };

		const uuidPerson1 = generatePersonUUID(person1);
		const uuidPerson2 = generatePersonUUID(person2);

		if (uuidPerson1 !== uuidPerson2) {
			console.log(`✅ Different persons generate different UUIDs\n`);
		} else {
			console.log(`❌ Different persons generated same UUID\n`);
		}

		// Test 5: Case insensitive email handling
		console.log("Test 5: Testing case insensitive email handling...");
		const lowerEmail = { ...testPerson, emails: "john@example.com" };
		const upperEmail = { ...testPerson, emails: "JOHN@EXAMPLE.COM" };

		const uuidLower = generatePersonUUID(lowerEmail);
		const uuidUpper = generatePersonUUID(upperEmail);

		if (uuidLower === uuidUpper) {
			console.log(`✅ Email comparison is case insensitive\n`);
		} else {
			console.log(`❌ Email comparison is case sensitive\n`);
		}

		// Test 6: Real CSV data deduplication on Cambodia.csv only
		console.log("Test 6: Testing deduplication on Cambodia.csv...");

		const csvPath = path.join(
			os.homedir(),
			"leads",
			"Cambodia",
			"Cambodia.csv",
		);
		console.log(`\nProcessing ${csvPath}...`);

		// Use streaming to process CSV
		const uuidMap = new Map<
			string,
			{ count: number; records: z.infer<typeof PeopleSchema>[] }
		>();
		let totalRecords = 0;

		await processCsvInBatches(
			csvPath,
			async (batch) => {
				// Process each batch
				batch.forEach((record) => {
					totalRecords++;
					const uuid = generatePersonUUID(record);
					const existing = uuidMap.get(uuid);

					if (existing) {
						existing.count++;
						if (existing.records.length < 5) {
							// Only store first 5 examples
							existing.records.push(record);
						}
					} else {
						uuidMap.set(uuid, { count: 1, records: [record] });
					}
				});
			},
			{
				batchSize: 1000,
				maxConcurrency: 1,
			},
		);

		console.log(`Total records: ${totalRecords}`);

		// Count duplicates
		let totalDuplicates = 0;
		const duplicateEntries: Array<
			[string, { count: number; records: z.infer<typeof PeopleSchema>[] }]
		> = [];

		uuidMap.forEach((value, uuid) => {
			if (value.count > 1) {
				totalDuplicates += value.count - 1;
				duplicateEntries.push([uuid, value]);
			}
		});

		console.log(`\n📊 Overall Statistics:`);
		console.log(`Total records: ${totalRecords}`);
		console.log(`Unique people (UUIDs): ${uuidMap.size}`);
		console.log(`Duplicate records: ${totalDuplicates}`);
		console.log(
			`Deduplication rate: ${((totalDuplicates / totalRecords) * 100).toFixed(2)}%`,
		);

		// Show some duplicate examples
		console.log(`\n🔍 Sample duplicates (first 10):`);
		duplicateEntries
			.sort((a, b) => b[1].count - a[1].count) // Sort by count descending
			.slice(0, 10)
			.forEach(([uuid, data]) => {
				const first = data.records[0];
				console.log(`\n  UUID: ${uuid.substring(0, 8)}...`);
				console.log(`  Name: ${first.full_name}`);
				console.log(`  Email: ${first.emails || "(no email)"}`);
				console.log(`  Appears ${data.count} times`);
			});

		console.log("\n✨ All UUID deduplication tests completed!");
	} catch (error) {
		console.error("❌ Test failed:", error);
		process.exit(1);
	}
};

// Run tests
testUUIDDeduplication();
