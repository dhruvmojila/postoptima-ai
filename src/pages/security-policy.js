import Link from "next/link";

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Security Policy
          </h1>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Vulnerability Disclosure Policy
            </h2>

            <p className="text-gray-300 mb-6">
              PostOptima AI is committed to maintaining the security of our
              platform and protecting our users&apos; data. We welcome security
              researchers and users to report any vulnerabilities they discover.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">
              How to Report Security Issues
            </h3>

            <p className="text-gray-300 mb-4">
              If you discover a security vulnerability, please report it to us
              at:
            </p>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <p className="text-purple-400 font-mono">
                Email: security@postoptima.com
              </p>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">
              What to Include in Your Report
            </h3>

            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Description of the vulnerability</li>
              <li>Steps to reproduce the issue</li>
              <li>Potential impact assessment</li>
              <li>Suggested fix (if available)</li>
              <li>Your contact information</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">
              Our Response Process
            </h3>

            <ol className="text-gray-300 mb-6 list-decimal pl-6">
              <li>We will acknowledge receipt within 24 hours</li>
              <li>Initial assessment within 3 business days</li>
              <li>Regular updates on progress</li>
              <li>Public disclosure after fix is deployed</li>
            </ol>

            <h3 className="text-xl font-semibold text-white mb-3">
              Security Best Practices
            </h3>

            <p className="text-gray-300 mb-4">
              We follow industry best practices to secure our platform:
            </p>

            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Regular security audits and penetration testing</li>
              <li>Encryption of data in transit and at rest</li>
              <li>Multi-factor authentication for admin access</li>
              <li>Regular security updates and patches</li>
              <li>Employee security training programs</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">
              Responsible Disclosure
            </h3>

            <p className="text-gray-300 mb-6">We ask that you:</p>

            <ul className="text-gray-300 mb-6 list-disc pl-6">
              <li>Do not access or modify other users&apos; data</li>
              <li>
                Do not perform actions that may negatively impact other users
              </li>
              <li>
                Do not publicly disclose the vulnerability before we&apos;ve had
                time to address it
              </li>
              <li>Give us reasonable time to respond and fix the issue</li>
            </ul>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> This security policy is based on industry
                standards and may be updated as our security practices evolve.
                We appreciate your cooperation in keeping our platform secure.
              </p>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
