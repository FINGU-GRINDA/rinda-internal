import Link from "next/link";

export default function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden px-6 lg:px-8">
				<div className="mx-auto max-w-7xl py-24 sm:py-32 lg:py-40">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
							Intuitive Lead Finder & Enrichment Platform
						</h1>
						<p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
							Discover high-quality leads and enrich your data with
							comprehensive insights. Powered by advanced AI and semantic search
							technology.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								href="/auth"
								className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Get Started
							</Link>
							<Link
								href="#features"
								className="text-sm font-semibold leading-6 text-gray-900"
							>
								Learn more <span aria-hidden="true">→</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-24 sm:py-32">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl lg:text-center">
						<h2 className="text-base font-semibold leading-7 text-indigo-600">
							Powerful Features
						</h2>
						<p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							Everything you need to find and enrich leads
						</p>
					</div>
					<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
						<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
							<div className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
									<div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
										<svg
											className="h-6 w-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
											/>
										</svg>
									</div>
									Smart Search
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
									<p className="flex-auto">
										Advanced semantic search powered by AI to find the most
										relevant leads based on your specific criteria and
										requirements.
									</p>
								</dd>
							</div>
							<div className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
									<div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
										<svg
											className="h-6 w-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
											/>
										</svg>
									</div>
									Data Enrichment
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
									<p className="flex-auto">
										Automatically enrich your leads with comprehensive data
										including contact information, company details, and social
										profiles.
									</p>
								</dd>
							</div>
							<div className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
									<div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
										<svg
											className="h-6 w-6 text-white"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
											/>
										</svg>
									</div>
									Real-time Updates
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
									<p className="flex-auto">
										Get the latest information with real-time data updates and
										notifications when lead information changes.
									</p>
								</dd>
							</div>
						</dl>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="bg-indigo-600 py-16 sm:py-24">
				<div className="mx-auto max-w-7xl px-6 lg:px-8">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
							Ready to supercharge your lead generation?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-200">
							Join thousands of sales teams using Rinda to find and enrich their
							leads.
						</p>
						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								href="/auth"
								className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
							>
								Start Free Trial
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
