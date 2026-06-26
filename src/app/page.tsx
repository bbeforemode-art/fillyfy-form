import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fillyfy — Know exactly what to fill',
  description: 'AI-powered form field explanations. Click any form field and instantly understand what to enter, why it\'s asked, and common mistakes to avoid.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Know exactly what to fill — before you fill it.
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 sm:text-xl">
            AI-powered form field explanations. Click any form field and instantly understand what to enter, why it&apos;s asked, and common mistakes to avoid.
          </p>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              Add to Chrome — Free
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-center text-gray-400">Three simple steps to clarity</p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold">Detect</h3>
              <p className="mt-3 text-gray-400">
                Fillyfy automatically detects forms on any page you visit.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-600/10 text-cyan-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold">Click</h3>
              <p className="mt-3 text-gray-400">
                Click any field to get an instant explanation.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/10 text-purple-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold">Understand</h3>
              <p className="mt-3 text-gray-400">
                Get clear guidance on what to enter and why.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-24 bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Features</h2>
          <p className="mt-4 text-center text-gray-400">Everything you need to fill forms with confidence</p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">AI Explanations</h3>
              <p className="mt-2 text-gray-400">
                Powered by Claude AI to give you clear, contextual explanations for any form field.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-600/10 text-cyan-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Sidebar Display</h3>
              <p className="mt-2 text-gray-400">
                Explanations appear in a clean sidebar that doesn&apos;t interfere with the form.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/10 text-green-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Auto-Detection</h3>
              <p className="mt-2 text-gray-400">
                Automatically finds and highlights form fields on any webpage you visit.
              </p>
            </div>
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/10 text-purple-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Usage Tracking</h3>
              <p className="mt-2 text-gray-400">
                Keep track of how many explanations you&apos;ve used this month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Simple Pricing</h2>
          <p className="mt-4 text-center text-gray-400">Start free. Upgrade when you need more forms.</p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Free Plan */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-lg font-semibold">Free</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">Try it out</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  1 form per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  AI-powered explanations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Sidebar display
                </li>
              </ul>
              <a
                href="#"
                className="mt-6 block w-full rounded-lg border border-gray-700 py-2.5 text-center text-sm font-semibold transition hover:bg-gray-800"
              >
                Get Started
              </a>
            </div>

            {/* Starter Plan */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-lg font-semibold">Starter</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$10</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">For regular form filling</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  15 forms per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  AI-powered explanations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Sidebar display
                </li>
              </ul>
              <a
                href="#"
                className="mt-6 block w-full rounded-lg border border-gray-700 py-2.5 text-center text-sm font-semibold transition hover:bg-gray-800"
              >
                Get Starter
              </a>
            </div>

            {/* Pro Plan */}
            <div className="relative rounded-xl border-2 border-indigo-500 bg-gray-900 p-6 shadow-lg shadow-indigo-500/10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium">
                Popular
              </div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$25</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">For power users</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  50 forms per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  AI-powered explanations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <a
                href="#"
                className="mt-6 block w-full rounded-lg bg-indigo-600 py-2.5 text-center text-sm font-semibold transition hover:bg-indigo-500"
              >
                Upgrade to Pro
              </a>
            </div>

            {/* Business Plan */}
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
              <h3 className="text-lg font-semibold">Business</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="mt-3 text-sm text-gray-400">For teams and heavy usage</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  300 forms per month
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  AI-powered explanations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <a
                href="#"
                className="mt-6 block w-full rounded-lg border border-gray-700 py-2.5 text-center text-sm font-semibold transition hover:bg-gray-800"
              >
                Get Business
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 sm:py-24 bg-gray-900/50">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-16 space-y-8">
            <div>
              <h3 className="text-lg font-semibold">What data does Fillyfy collect?</h3>
              <p className="mt-3 text-gray-400">
                Fillyfy sends only the form field context (label, placeholder, type) to our AI for explanation. We collect your email for authentication and track monthly usage counts. We never store the field context permanently and never sell your data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Which browsers are supported?</h3>
              <p className="mt-3 text-gray-400">
                Fillyfy is available as a Chrome extension and works on all Chromium-based browsers including Chrome, Edge, Brave, and Arc.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">How does it work?</h3>
              <p className="mt-3 text-gray-400">
                When you click a form field, Fillyfy captures the field&apos;s context (label, type, surrounding form info) and sends it to our AI backend. Claude AI analyzes the context and returns a clear explanation of what to enter, why it&apos;s asked, and common mistakes to avoid.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Can I cancel anytime?</h3>
              <p className="mt-3 text-gray-400">
                Yes. You can cancel your subscription at any time. Your access continues until the end of the current billing period, then you&apos;ll revert to the free plan with 1 form per month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-12">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-gray-400 transition hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-400 transition hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-400 transition hover:text-white">
              Chrome Web Store
            </a>
          </div>
          <p className="text-sm text-gray-500">
            &copy; 2024 Fillyfy. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
