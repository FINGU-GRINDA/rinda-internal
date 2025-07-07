export default function TermsOfService() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

			<div className="prose prose-sm max-w-none">
				<p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					1. Acceptance of Terms
				</h2>
				<p className="mb-4">
					By accessing and using this service, you accept and agree to be bound
					by the terms and provision of this agreement.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">2. Use License</h2>
				<p className="mb-4">
					Permission is granted to temporarily download one copy of the
					materials (information or software) on our service for personal,
					non-commercial transitory viewing only.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">3. Disclaimer</h2>
				<p className="mb-4">
					The materials on our service are provided on an 'as is' basis. We make
					no warranties, expressed or implied, and hereby disclaim and negate
					all other warranties including, without limitation, implied warranties
					or conditions of merchantability, fitness for a particular purpose, or
					non-infringement of intellectual property or other violation of
					rights.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">4. Limitations</h2>
				<p className="mb-4">
					In no event shall our company or its suppliers be liable for any
					damages (including, without limitation, damages for loss of data or
					profit, or due to business interruption) arising out of the use or
					inability to use the materials on our service, even if we or our
					authorized representative has been notified orally or in writing of
					the possibility of such damage.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">
					5. Accuracy of Materials
				</h2>
				<p className="mb-4">
					The materials appearing on our service could include technical,
					typographical, or photographic errors. We do not warrant that any of
					the materials on its service are accurate, complete, or current.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">6. Links</h2>
				<p className="mb-4">
					We have not reviewed all of the sites linked to our service and are
					not responsible for the contents of any such linked site. The
					inclusion of any link does not imply endorsement by us of the site.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">7. Modifications</h2>
				<p className="mb-4">
					We may revise these terms of service for its service at any time
					without notice. By using this service, you are agreeing to be bound by
					the then current version of these terms of service.
				</p>

				<h2 className="text-2xl font-semibold mt-6 mb-4">8. Governing Law</h2>
				<p className="mb-4">
					These terms and conditions are governed by and construed in accordance
					with the laws and you irrevocably submit to the exclusive jurisdiction
					of the courts in that State or location.
				</p>
			</div>
		</div>
	);
}
