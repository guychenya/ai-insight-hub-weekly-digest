import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans antialiased">
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-300 hover:to-purple-400 transition-all duration-300">
            ← Back to AI Insight Hub
          </a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-yellow-400 font-semibold mb-2">Demo Application Notice</h3>
                <p className="text-yellow-200 text-sm">
                  This is a demonstration application created to showcase AI-powered content generation capabilities using Vibe-Coding methodologies. 
                  All content is generated for demonstration purposes only and should not be considered as actual news or factual information.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">1. Information We Collect</h2>
                <div className="text-gray-300 space-y-3">
                  <p>This demo application may collect the following information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>GitHub authentication data (username, email, avatar) when you sign in</li>
                    <li>Usage analytics for demo purposes</li>
                    <li>Generated content interactions for demonstration analytics</li>
                    <li>Browser and device information for optimal display</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">2. How We Use Your Information</h2>
                <div className="text-gray-300 space-y-3">
                  <p>Information collected is used solely for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Demonstrating the application's functionality</li>
                    <li>Providing a personalized demo experience</li>
                    <li>Improving the demonstration capabilities</li>
                    <li>Analytics to understand demo usage patterns</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">3. Data Storage and Security</h2>
                <div className="text-gray-300 space-y-3">
                  <p>Your data is stored securely using:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Firebase Firestore for demo data persistence</li>
                    <li>Industry-standard encryption for data transmission</li>
                    <li>Secure authentication through GitHub OAuth</li>
                    <li>Data retention policies appropriate for demonstration purposes</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">4. Third-Party Services</h2>
                <div className="text-gray-300 space-y-3">
                  <p>This demo application integrates with:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Google Gemini AI for content generation</li>
                    <li>Firebase for authentication and data storage</li>
                    <li>GitHub for OAuth authentication</li>
                    <li>Netlify for hosting and deployment</li>
                  </ul>
                  <p>Each service has its own privacy policy and terms of service.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">5. Demo Content Disclaimer</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    All AI-generated content in this application is created for demonstration purposes only. 
                    This includes news articles, insights, and any other content displayed. 
                    None of the generated content should be considered as factual information, real news, or professional advice.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">6. Your Rights</h2>
                <div className="text-gray-300 space-y-3">
                  <p>As a demo user, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your demo data</li>
                    <li>Request deletion of your demo data</li>
                    <li>Opt out of analytics collection</li>
                    <li>Understand how your data is used in the demo</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">7. Contact Information</h2>
                <div className="text-gray-300 space-y-3">
                  <p>For questions about this privacy policy or the demo application:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Visit: <a href="https://www.guyc.dev" className="text-blue-400 hover:text-blue-300 transition-colors">www.guyc.dev</a></li>
                    <li>Email: Contact form available on the website</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">8. Changes to This Policy</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    This privacy policy may be updated to reflect changes in the demo application or legal requirements. 
                    Any changes will be posted on this page with an updated date.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;