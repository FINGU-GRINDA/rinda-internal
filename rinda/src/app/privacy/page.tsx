export default function PrivacyPolicy() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

			<div className="prose prose-sm max-w-none">
				<p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					1. Information We Collect
				</h2>
				<p className="mb-4">
					We collect information you provide directly to us, such as when you
					create an account, submit a form, or contact us.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					2. How We Use Your Information
				</h2>
				<p className="mb-4">
					We use the information we collect to provide, maintain, and improve
					our services, communicate with you, and comply with legal obligations.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					3. Information Sharing
				</h2>
				<p className="mb-4">
					We do not sell, trade, or otherwise transfer your personal information
					to third parties without your consent, except as described in this
					policy.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">4. Data Security</h2>
				<p className="mb-4">
					We implement appropriate technical and organizational measures to
					protect your personal information against unauthorized access,
					alteration, disclosure, or destruction.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">5. Your Rights</h2>
				<p className="mb-4">
					You have the right to access, update, or delete your personal
					information. You may also opt out of certain communications from us.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">6. Cookies</h2>
				<p className="mb-4">
					We use cookies and similar tracking technologies to track activity on
					our service and hold certain information. You can instruct your
					browser to refuse all cookies or to indicate when a cookie is being
					sent.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					7. Children's Privacy
				</h2>
				<p className="mb-4">
					Our service is not intended for children under 13 years of age. We do
					not knowingly collect personal information from children under 13.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					8. Changes to This Policy
				</h2>
				<p className="mb-4">
					We may update our Privacy Policy from time to time. We will notify you
					of any changes by posting the new Privacy Policy on this page.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">9. Contact Us</h2>
				<p className="mb-4">
					If you have any questions about this Privacy Policy, please contact
					us.
				</p>
			</div>
		</div>
	);
}
