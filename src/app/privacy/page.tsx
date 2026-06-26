import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Fillyfy',
  description: 'How Fillyfy collects, stores, and processes your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-gray-400">Last updated: June 2025</p>

        <div className="mt-12 space-y-10 text-gray-300 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-white">What Data We Collect</h2>
            <p className="mt-3">
              Fillyfy collects the following information to provide our service:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Field context</strong> — When you click a form field, we send the field label, placeholder, type, and surrounding form context to our AI for explanation. This data is processed in real time and is not stored permanently.
              </li>
              <li>
                <strong>Email address</strong> — Collected during authentication to identify your account.
              </li>
              <li>
                <strong>Monthly usage counts</strong> — We track how many explanations you request each month to enforce plan limits.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">How Data Is Stored</h2>
            <p className="mt-3">
              Your account information and usage data are stored in Supabase (PostgreSQL) with encryption at rest. We use industry-standard security practices to protect your data, including encrypted connections and access controls.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Data Processing</h2>
            <p className="mt-3">
              When you request a field explanation, the field context is sent to the Anthropic Claude API for processing. This data is used solely to generate your explanation and is not stored permanently by Fillyfy or Anthropic beyond what is needed to process the request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Third-Party Data Sharing</h2>
            <p className="mt-3">
              We do not sell, rent, or share your personal data with third parties for marketing or advertising purposes. Your data is only shared with service providers (Anthropic, Supabase, Stripe, Clerk) as necessary to operate the Fillyfy service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Your Rights</h2>
            <p className="mt-3">
              You may request deletion of your account and associated data at any time by contacting us. Upon account deletion, all your data will be permanently removed from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-3">
              For privacy-related inquiries, please contact us at{' '}
              <a href="mailto:privacy@fillyfy.com" className="text-indigo-400 hover:text-indigo-300">
                privacy@fillyfy.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition">
            &larr; Back to home
          </a>
        </div>
      </div>
    </main>
  );
}
