import {
	ArrowRight,
	BookOpen,
	Code,
	Database,
	Key,
	Lock,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
	title: "API Reference | Rinda Internal",
	description:
		"Complete API documentation for integrating Rinda Internal into your applications.",
};

const apiEndpoints = [
	{
		method: "GET",
		endpoint: "/api/v1/websets",
		description: "List all websets for the authenticated user",
		category: "Websets",
	},
	{
		method: "POST",
		endpoint: "/api/v1/websets",
		description: "Create a new webset with search criteria",
		category: "Websets",
	},
	{
		method: "GET",
		endpoint: "/api/v1/websets/{id}",
		description: "Get details of a specific webset",
		category: "Websets",
	},
	{
		method: "DELETE",
		endpoint: "/api/v1/websets/{id}",
		description: "Delete a webset and all associated data",
		category: "Websets",
	},
	{
		method: "GET",
		endpoint: "/api/v1/leads",
		description: "Search and filter leads across all websets",
		category: "Leads",
	},
	{
		method: "GET",
		endpoint: "/api/v1/leads/{id}",
		description: "Get detailed information about a lead",
		category: "Leads",
	},
	{
		method: "POST",
		endpoint: "/api/v1/leads/validate",
		description: "Trigger AI validation for specific leads",
		category: "Leads",
	},
	{
		method: "POST",
		endpoint: "/api/v1/export",
		description: "Export leads in various formats (CSV, JSON, Excel)",
		category: "Export",
	},
	{
		method: "GET",
		endpoint: "/api/v1/integrations",
		description: "List all active integrations",
		category: "Integrations",
	},
	{
		method: "POST",
		endpoint: "/api/v1/webhooks",
		description: "Configure webhook endpoints",
		category: "Webhooks",
	},
];

const codeExamples = {
	curl: `curl -X POST https://api.rinda-internal.com/v1/websets \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Tech Startups in SF",
    "query": "technology startups in San Francisco with Series A funding",
    "validation_criteria": {
      "company_size": {"min": 10, "max": 50},
      "industry": ["Software", "SaaS", "AI/ML"],
      "funding_stage": ["Series A", "Series B"]
    }
  }'`,
	python: `import requests

api_key = "YOUR_API_KEY"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

data = {
    "name": "Tech Startups in SF",
    "query": "technology startups in San Francisco with Series A funding",
    "validation_criteria": {
        "company_size": {"min": 10, "max": 50},
        "industry": ["Software", "SaaS", "AI/ML"],
        "funding_stage": ["Series A", "Series B"]
    }
}

response = requests.post(
    "https://api.rinda-internal.com/v1/websets",
    headers=headers,
    json=data
)

print(response.json())`,
	javascript: `const apiKey = 'YOUR_API_KEY';

const data = {
  name: 'Tech Startups in SF',
  query: 'technology startups in San Francisco with Series A funding',
  validation_criteria: {
    company_size: { min: 10, max: 50 },
    industry: ['Software', 'SaaS', 'AI/ML'],
    funding_stage: ['Series A', 'Series B']
  }
};

fetch('https://api.rinda-internal.com/v1/websets', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => console.log(result))
.catch(error => console.error('Error:', error));`,
};

const sdks = [
	{
		name: "Python SDK",
		language: "Python",
		description: "Official Python SDK with type hints and async support",
		href: "https://github.com/rinda-internal/python-sdk",
	},
	{
		name: "Node.js SDK",
		language: "JavaScript",
		description: "TypeScript-first SDK for Node.js applications",
		href: "https://github.com/rinda-internal/node-sdk",
	},
	{
		name: "Go SDK",
		language: "Go",
		description: "Idiomatic Go client with full API coverage",
		href: "https://github.com/rinda-internal/go-sdk",
	},
	{
		name: "Ruby SDK",
		language: "Ruby",
		description: "Ruby gem for seamless Rails integration",
		href: "https://github.com/rinda-internal/ruby-sdk",
	},
];

export default function ApiReferencePage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative py-16 sm:py-24 bg-gradient-to-b from-primary/5 to-background">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
							API Reference
						</h1>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Build powerful integrations with our comprehensive REST API.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg">
								<Link href="/docs/api-quickstart">Quick Start Guide</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link href="/auth">Get API Key</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Key Features */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-4 text-center">
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Zap className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">RESTful Design</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Intuitive REST API following industry best practices
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Lock className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Secure</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								OAuth 2.0 authentication with API key support
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<Database className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Rate Limited</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Fair usage with clear rate limit headers
							</p>
						</div>
						<div>
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
								<BookOpen className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-semibold">Well Documented</h3>
							<p className="mt-2 text-sm text-muted-foreground">
								Comprehensive docs with examples in multiple languages
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Code Examples */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Quick Example
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Create a webset and start finding leads in minutes
						</p>
					</div>
					<div className="mx-auto max-w-5xl">
						<Card className="overflow-hidden">
							<Tabs defaultValue="curl" className="w-full">
								<div className="border-b px-6">
									<TabsList className="h-14 bg-transparent">
										<TabsTrigger value="curl">cURL</TabsTrigger>
										<TabsTrigger value="python">Python</TabsTrigger>
										<TabsTrigger value="javascript">JavaScript</TabsTrigger>
									</TabsList>
								</div>
								<TabsContent value="curl" className="p-6">
									<pre className="overflow-x-auto bg-slate-900 text-slate-50 p-4 rounded-lg text-sm">
										<code>{codeExamples.curl}</code>
									</pre>
								</TabsContent>
								<TabsContent value="python" className="p-6">
									<pre className="overflow-x-auto bg-slate-900 text-slate-50 p-4 rounded-lg text-sm">
										<code>{codeExamples.python}</code>
									</pre>
								</TabsContent>
								<TabsContent value="javascript" className="p-6">
									<pre className="overflow-x-auto bg-slate-900 text-slate-50 p-4 rounded-lg text-sm">
										<code>{codeExamples.javascript}</code>
									</pre>
								</TabsContent>
							</Tabs>
						</Card>
					</div>
				</div>
			</section>

			{/* Endpoints */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							API Endpoints
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							All endpoints are available at https://api.rinda-internal.com/v1
						</p>
					</div>
					<div className="mx-auto max-w-5xl">
						<div className="space-y-4">
							{apiEndpoints.map((endpoint) => (
								<Card key={endpoint.endpoint} className="p-6">
									<div className="flex items-start gap-4">
										<Badge
											variant={
												endpoint.method === "GET"
													? "secondary"
													: endpoint.method === "POST"
														? "default"
														: "destructive"
											}
											className="font-mono"
										>
											{endpoint.method}
										</Badge>
										<div className="flex-1">
											<code className="text-sm font-mono">
												{endpoint.endpoint}
											</code>
											<p className="mt-2 text-sm text-muted-foreground">
												{endpoint.description}
											</p>
										</div>
										<Badge variant="outline">{endpoint.category}</Badge>
									</div>
								</Card>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* SDKs */}
			<section className="py-24 sm:py-32 bg-muted/50">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center mb-16">
						<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
							Official SDKs
						</h2>
						<p className="mt-6 text-lg leading-8 text-muted-foreground">
							Get started faster with our official client libraries
						</p>
					</div>
					<div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-2">
						{sdks.map((sdk) => (
							<Card
								key={sdk.name}
								className="p-6 hover:shadow-lg transition-shadow"
							>
								<Link href={sdk.href} className="group">
									<div className="flex items-start justify-between">
										<div>
											<h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
												{sdk.name}
											</h3>
											<Badge variant="outline" className="mt-2">
												{sdk.language}
											</Badge>
											<p className="mt-3 text-sm text-muted-foreground">
												{sdk.description}
											</p>
										</div>
										<ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
									</div>
								</Link>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Authentication */}
			<section className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-3xl">
						<div className="text-center mb-16">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
								<Key className="h-8 w-8 text-primary" />
							</div>
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
								Authentication
							</h2>
						</div>
						<Card className="p-8">
							<h3 className="text-xl font-semibold mb-4">
								API Key Authentication
							</h3>
							<p className="text-muted-foreground mb-6">
								All API requests must include your API key in the Authorization
								header:
							</p>
							<pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm overflow-x-auto">
								<code>Authorization: Bearer YOUR_API_KEY</code>
							</pre>
							<div className="mt-6 space-y-4">
								<div>
									<h4 className="font-semibold mb-2">Getting your API Key</h4>
									<p className="text-sm text-muted-foreground">
										You can generate API keys from your account settings. Each
										key can be scoped with specific permissions.
									</p>
								</div>
								<div>
									<h4 className="font-semibold mb-2">
										Security Best Practices
									</h4>
									<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
										<li>Never expose your API key in client-side code</li>
										<li>Rotate your keys regularly</li>
										<li>Use environment variables to store keys</li>
										<li>Restrict key permissions to only what's needed</li>
									</ul>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 sm:py-24 bg-primary">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
							Ready to Build?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
							Start integrating Rinda Internal into your applications today.
						</p>
						<div className="mt-10 flex items-center justify-center gap-4">
							<Button asChild size="lg" variant="secondary">
								<Link href="/auth">Get Your API Key</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
							>
								<Link href="/docs/api-quickstart">
									<Code className="mr-2 h-4 w-4" />
									View Docs
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
