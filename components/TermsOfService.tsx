import React from 'react';

const TermsOfService: React.FC = () => {
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
              Terms of Service
            </h1>
            <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-red-400 font-semibold mb-2">Important: Demo Application Only</h3>
                <p className="text-red-200 text-sm">
                  This is a demonstration application created to showcase Vibe-Coding methodologies. By using this application, 
                  you acknowledge that this is for demonstration purposes only and agree to the terms outlined below.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">1. Acceptance of Terms</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    By accessing or using the AI Insight Hub demonstration application ("Demo App"), you agree to be bound by these Terms of Service. 
                    If you do not agree to these terms, please do not use this Demo App.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">2. Demo Application Purpose</h2>
                <div className="text-gray-300 space-y-3">
                  <p>This application is provided solely for:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Demonstrating AI-powered content generation capabilities</li>
                    <li>Showcasing Vibe-Coding development methodologies</li>
                    <li>Educational and portfolio purposes</li>
                    <li>Technology demonstration and proof of concept</li>
                  </ul>
                  <p className="font-semibold text-yellow-400">
                    This is NOT a production application and should not be used for any commercial, professional, or critical purposes.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">3. Content Disclaimer</h2>
                <div className="text-gray-300 space-y-3">
                  <p className="font-semibold">ALL CONTENT IS GENERATED FOR DEMONSTRATION PURPOSES ONLY.</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI-generated articles and insights are fictional and for demonstration only</li>
                    <li>Content should not be considered as factual information or real news</li>
                    <li>No content should be used for decision-making or relied upon as accurate</li>
                    <li>Generated sources and citations are for demonstration purposes only</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">4. Limitation of Liability</h2>
                <div className="text-gray-300 space-y-3">
                  <p className="font-semibold">TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>This Demo App is provided "AS IS" without warranties of any kind</li>
                    <li>Guy Chenya shall not be liable for any direct, indirect, incidental, or consequential damages</li>
                    <li>No liability for any decisions made based on demo content</li>
                    <li>No responsibility for any technical issues, data loss, or service interruptions</li>
                    <li>Maximum liability, if any, shall not exceed $0 (zero dollars)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">5. No Warranty</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    This Demo App is provided without any express or implied warranties, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Merchantability or fitness for a particular purpose</li>
                    <li>Accuracy, reliability, or completeness of information</li>
                    <li>Uninterrupted or error-free operation</li>
                    <li>Security or data protection guarantees</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">6. User Responsibilities</h2>
                <div className="text-gray-300 space-y-3">
                  <p>By using this Demo App, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use the application only for demonstration and educational purposes</li>
                    <li>Not rely on any generated content for real-world decisions</li>
                    <li>Not attempt to exploit or misuse the demonstration features</li>
                    <li>Understand that this is a proof-of-concept application</li>
                    <li>Not hold the developer liable for any issues arising from use</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">7. Third-Party Services</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    This Demo App integrates with third-party services (Google Gemini AI, Firebase, GitHub, Netlify). 
                    Your use of these services is subject to their respective terms of service and privacy policies. 
                    Guy Chenya is not responsible for the performance or policies of these third-party services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">8. Intellectual Property</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    The Demo App code and design are the intellectual property of Guy Chenya. 
                    Generated content is created by AI for demonstration purposes and should not be considered original work of any party.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">9. Termination</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    Access to this Demo App may be terminated at any time without notice. 
                    These terms shall survive any termination of your access to the application.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">10. Governing Law</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    These terms shall be governed by and construed in accordance with applicable law. 
                    Any disputes shall be resolved through binding arbitration or small claims court.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">11. Changes to Terms</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    These terms may be updated at any time without notice. Your continued use of the Demo App 
                    after any changes constitutes acceptance of the new terms.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">12. Contact Information</h2>
                <div className="text-gray-300 space-y-3">
                  <p>
                    For questions about these terms or the Demo App:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Visit: <a href="https://www.guyc.dev" className="text-blue-400 hover:text-blue-300 transition-colors">www.guyc.dev</a></li>
                    <li>Contact through the website's contact form</li>
                  </ul>
                </div>
              </section>

              <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-400 text-center">
                  By using this demonstration application, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;