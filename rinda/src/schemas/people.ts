import { z } from "zod";

export const CreatePeopleSchema = z.object({
	full_name: z.string().nullish(),
	industry: z.string().nullish(),
	job_title: z.string().nullish(),
	sub_role: z.string().nullish(),
	emails: z.string().nullish(),
	mobile: z.string().or(z.number()).nullish(),
	phone_numbers: z.string().nullish(),
	company_name: z.string().nullish(),
	company_industry: z.string().nullish(),
	company_website: z.string().nullish(),
	company_size: z.string().or(z.number()).nullish(),
	location: z.string().nullish(),
	skills: z.string().nullish(),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
	birth_year: z.string().or(z.number()).nullish(),
	birth_date: z.string().or(z.date()).or(z.number()).nullish(),
	gender: z.string().nullish(),
	linkedin_url: z.string().nullish(),
	facebook_url: z.string().nullish(),
	twitter_url: z.string().nullish(),
	github_url: z.string().nullish(),
	company_linkedin_url: z.string().nullish(),
	company_facebook_url: z.string().nullish(),
	company_twitter_url: z.string().nullish(),
	company_location_name: z.string().nullish(),
	company_location_street_address: z.string().nullish(),
	company_location_address_line_2: z.string().nullish(),
	company_location_postal_code: z.string().or(z.number()).nullish(),
	location_country: z.string().nullish(),
	location_continent: z.string().nullish(),
	linkedin_connections: z.string().or(z.number()).nullish(),
	inferred_salary: z.string().or(z.number()).nullish(),
	years_experience: z.string().or(z.number()).nullish(),
	countries: z.string().nullish(),
	interests: z.string().nullish(),
});

export const PeopleSchema = z.object({
	id: z.string().uuid(),
	full_name: z.string().nullish(),
	industry: z.string().nullish(),
	job_title: z.string().nullish(),
	sub_role: z.string().nullish(),
	emails: z.string().nullish(),
	mobile: z.string().or(z.number()).nullish(),
	phone_numbers: z.string().nullish(),
	company_name: z.string().nullish(),
	company_industry: z.string().nullish(),
	company_website: z.string().nullish(),
	company_size: z.string().or(z.number()).nullish(),
	location: z.string().nullish(),
	skills: z.string().nullish(),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
	birth_year: z.string().or(z.number()).nullish(),
	birth_date: z.string().or(z.date()).or(z.number()).nullish(),
	gender: z.string().nullish(),
	linkedin_url: z.string().nullish(),
	facebook_url: z.string().nullish(),
	twitter_url: z.string().nullish(),
	github_url: z.string().nullish(),
	company_linkedin_url: z.string().nullish(),
	company_facebook_url: z.string().nullish(),
	company_twitter_url: z.string().nullish(),
	company_location_name: z.string().nullish(),
	company_location_street_address: z.string().nullish(),
	company_location_address_line_2: z.string().nullish(),
	company_location_postal_code: z.string().or(z.number()).nullish(),
	location_country: z.string().nullish(),
	location_continent: z.string().nullish(),
	linkedin_connections: z.string().or(z.number()).nullish(),
	inferred_salary: z.string().or(z.number()).nullish(),
	years_experience: z.string().or(z.number()).nullish(),
	countries: z.string().nullish(),
	interests: z.string().nullish(),
});

export const UpdatePeopleSchema = z.object({
	full_name: z.string().nullish(),
	industry: z.string().nullish(),
	job_title: z.string().nullish(),
	sub_role: z.string().nullish(),
	emails: z.string().nullish(),
	mobile: z.string().or(z.number()).nullish(),
	phone_numbers: z.string().nullish(),
	company_name: z.string().nullish(),
	company_industry: z.string().nullish(),
	company_website: z.string().nullish(),
	company_size: z.string().or(z.number()).nullish(),
	location: z.string().nullish(),
	skills: z.string().nullish(),
	first_name: z.string().nullish(),
	last_name: z.string().nullish(),
	birth_year: z.string().or(z.number()).nullish(),
	birth_date: z.string().or(z.date()).or(z.number()).nullish(),
	gender: z.string().nullish(),
	linkedin_url: z.string().nullish(),
	facebook_url: z.string().nullish(),
	twitter_url: z.string().nullish(),
	github_url: z.string().nullish(),
	company_linkedin_url: z.string().nullish(),
	company_facebook_url: z.string().nullish(),
	company_twitter_url: z.string().nullish(),
	company_location_name: z.string().nullish(),
	company_location_street_address: z.string().nullish(),
	company_location_address_line_2: z.string().nullish(),
	company_location_postal_code: z.string().or(z.number()).nullish(),
	location_country: z.string().nullish(),
	location_continent: z.string().nullish(),
	linkedin_connections: z.string().or(z.number()).nullish(),
	inferred_salary: z.string().or(z.number()).nullish(),
	years_experience: z.string().or(z.number()).nullish(),
	countries: z.string().nullish(),
	interests: z.string().nullish(),
});
