'use client';

import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import HeroDemo from '@/components/HeroDemo';
import FAQ from '@/components/FAQ';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const styles: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' },
    red: { bg: '#FEF2F2', border: '#FECACA', text: '#EF4444' },
  };
  const s = styles[color] || styles.blue;
  return (
    <span
      className="inline-block text-[11px] font-bold uppercase tracking-[0.1em] px-3.5 py-1.5 rounded-full mb-4"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Nav />

      {/* Hero Section */}
      <section
        id="hero"
        className="min-h-screen flex items-center pt-[88px] pb-[60px] px-6"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 72% 5%, rgba(37,99,235,0.07) 0%, transparent 65%), #fff' }}
      >
        <div className="max-w-[1160px] mx-auto w-full flex flex-wrap items-center gap-14">
          {/* Left Column */}
          <div className="flex-1 min-w-[320px] max-w-[540px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0 }}
              className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full px-3.5 py-[5px] mb-6"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-[#2563EB]" style={{ animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span className="text-[13px] font-semibold text-[#2563EB]">Now available — free to install</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display text-[#0F172A] leading-[1.06] tracking-[-0.02em] font-normal mb-6"
              style={{ fontSize: 'clamp(40px, 5vw, 60px)' }}
            >
              Never wonder what a form is asking again.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-[17px] leading-[1.72] text-[#64748B] max-w-[480px] mb-8"
            >
              Click any form field. Fillyfy instantly explains what it means, what to enter, common mistakes, and what documents you may need — without leaving the page.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white text-[15px] font-semibold px-6 py-[13px] rounded-[10px] hover:bg-[#1D4ED8] hover:-translate-y-px transition-all"
                style={{ boxShadow: '0 2px 10px rgba(37,99,235,0.28)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
                Add to Chrome — Free
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white border-[1.5px] border-[#E2E8F0] text-[#374151] text-[15px] font-semibold px-5 py-[13px] rounded-[10px] hover:border-[#CBD5E1] hover:bg-[#F8FAFF] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                Watch 30s demo
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#64748B]"
            >
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#2563EB"><circle cx="12" cy="12" r="10" /></svg>
                Chrome Web Store
              </span>
              <span className="text-[#CBD5E1]">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><rect x="4" y="4" width="16" height="16" rx="3" /></svg>
                AWS Bedrock
              </span>
              <span className="text-[#CBD5E1]">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#D97706"><circle cx="12" cy="12" r="10" /></svg>
                Claude AI
              </span>
              <span className="text-[#CBD5E1]">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#16A34A"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" /></svg>
                Privacy First
              </span>
            </motion.div>
          </div>

          {/* Right Column - Demo */}
          <div className="flex-1 min-w-[320px] max-w-[580px] lg:min-w-[460px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <HeroDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-[#F8FAFF] border-t border-b border-[#EFF6FF] py-7 px-6">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8] mb-5">
          Trusted infrastructure — built for privacy and scale
        </p>
        <div className="flex justify-center flex-wrap gap-11 opacity-60">
          {[
            { icon: '🔵', label: 'Chrome Web Store' },
            { icon: '🟠', label: 'AWS Bedrock' },
            { icon: '🟤', label: 'Claude AI' },
            { icon: '🟣', label: 'Clerk Auth' },
            { icon: '🟢', label: 'Privacy First' },
            { icon: '🔒', label: 'E2E Encrypted' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-[14px] font-semibold text-[#1E293B]">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="bg-white py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <SectionLabel color="red">The problem</SectionLabel>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mt-4 mb-4" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              You&apos;re in the middle of something important. And you&apos;re stuck.
            </h2>
            <p className="text-[17px] text-[#64748B] max-w-[580px] mx-auto mb-12">
              Government forms. Visa applications. Tax filings. The fields are confusing, the stakes are high, and Googling doesn&apos;t always help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              { emoji: '😕', title: 'Confusing field names', body: '"Alien Registration Number"? "Prior Year AGI"? These aren\'t everyday terms — but they expect you to know them.', bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', bodyColor: '#7F1D1D' },
              { emoji: '🔍', title: 'Five tabs. No clear answer.', body: 'You open Google, Reddit, official docs... 15 minutes later you\'re still not sure if you found the right answer.', bg: '#FFFBEB', border: '#FDE68A', titleColor: '#92400E', bodyColor: '#78350F' },
              { emoji: '🤞', title: 'You guess and hope.', body: 'Eventually you just enter something and pray it doesn\'t delay your application or trigger a rejection.', bg: '#F0FDF4', border: '#BBF7D0', titleColor: '#166534', bodyColor: '#14532D' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="rounded-2xl p-7 text-left"
                style={{ background: card.bg, border: `1px solid ${card.border}` }}
              >
                <div className="text-2xl mb-3">{card.emoji}</div>
                <h3 className="text-[16px] font-bold mb-2" style={{ color: card.titleColor }}>{card.title}</h3>
                <p className="text-[14px] leading-[1.65]" style={{ color: card.bodyColor }}>{card.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <span className="inline-block bg-[#EFF6FF] px-9 py-[15px] rounded-full text-[16px] font-semibold text-[#2563EB]">
              There&apos;s a better way →
            </span>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-[#F8FAFF] py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mt-4 mb-12" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Three steps. No learning curve.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { emoji: '🌐', step: 'Step 1', title: 'Open any form', body: 'Navigate to any website with a form — government, banking, startup applications, anything.' },
              { emoji: '👆', step: 'Step 2', title: 'Click a confusing field', body: 'Click on any form field you don\'t understand. That\'s it — one click.' },
              { emoji: '✨', step: 'Step 3', title: 'Understand instantly', body: 'A sidebar appears with a clear explanation: what it means, what to enter, and mistakes to avoid.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-[22px] mb-4"
                  style={{ boxShadow: '0 4px 18px rgba(37,99,235,0.26)' }}
                >
                  {item.emoji}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.09em] text-[#94A3B8] mb-2">{item.step}</span>
                <h3 className="text-[19px] font-bold text-[#0F172A] mb-2">{item.title}</h3>
                <p className="text-[15px] text-[#64748B] leading-[1.68]">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="examples" className="bg-white py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <SectionLabel>Use cases</SectionLabel>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mt-4 mb-4" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Any form. Any website.
            </h2>
            <p className="text-[17px] text-[#64748B] max-w-[580px] mx-auto mb-12">
              From immigration to taxes to startup applications — Fillyfy works wherever forms are confusing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {[
              { emoji: '🏛️', title: 'Government', desc: 'USCIS, SSA, state agencies, DMV, and federal forms.' },
              { emoji: '🌍', title: 'Visa & Immigration', desc: 'DS-160, I-485, travel authorizations, and consulate forms.' },
              { emoji: '🚀', title: 'Startup Funding', desc: 'AWS Activate, YC, grants, and accelerator applications.' },
              { emoji: '🏦', title: 'Banking', desc: 'Account applications, loan forms, and KYC verification.' },
              { emoji: '📋', title: 'Tax', desc: 'IRS forms, state returns, estimated payments, and W-4s.' },
              { emoji: '🎓', title: 'University', desc: 'FAFSA, admissions portals, scholarship applications.' },
              { emoji: '🏥', title: 'Healthcare', desc: 'Insurance enrollment, claims, prior authorizations.' },
              { emoji: '☁️', title: 'Cloud & Enterprise', desc: 'AWS, Azure, GCP console forms and configurations.' },
              { emoji: '🏪', title: 'Business Registration', desc: 'LLC filings, EIN applications, state registrations.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.05 }}
                className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-xl p-[22px] text-left hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:-translate-y-0.5 transition-all duration-200 cursor-default"
              >
                <div className="text-2xl mb-2">{card.emoji}</div>
                <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">{card.title}</h3>
                <p className="text-[13px] text-[#64748B] leading-[1.5]">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#F8FAFF] py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <SectionLabel>Features</SectionLabel>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mt-4 mb-12" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Everything you need. Nothing you don&apos;t.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { emoji: '💡', title: 'Instant Field Explanations', body: 'Click any form field and get a plain-language explanation of what it\'s asking, in context.' },
              { emoji: '📄', title: 'Document Guidance', body: 'Know exactly which documents you need and where to find the information being requested.' },
              { emoji: '🧠', title: 'Context-Aware Analysis', body: 'AI understands the form type, your field, and surrounding context for accurate explanations.' },
              { emoji: '🛡️', title: 'Mistake Prevention', body: 'See common mistakes others make on each field so you can avoid delays and rejections.' },
              { emoji: '🌐', title: 'Works Everywhere', body: 'Government sites, banking portals, startup forms — works on any website with form fields.' },
              { emoji: '🔒', title: 'Privacy by Design', body: 'No data stored, no training on your info, encrypted in transit. Your privacy comes first.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-7 text-left hover:border-[#BFDBFE] hover:shadow-[0_4px_24px_rgba(37,99,235,0.08)] transition-all duration-200"
              >
                <div className="w-11 h-11 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-[20px] mb-4">
                  {card.emoji}
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-2">{card.title}</h3>
                <p className="text-[14px] text-[#64748B] leading-[1.65]">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-white py-20 px-6">
        <div className="max-w-[880px] mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl p-14 text-center"
            style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', border: '1px solid #BFDBFE' }}
          >
            <div className="text-[40px] mb-4">🔐</div>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mb-4" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Your data never leaves the field.
            </h2>
            <p className="text-[17px] text-[#64748B] max-w-[520px] mx-auto mb-8">
              Fillyfy processes field context in real-time and discards it immediately. No storage, no training, no data collection.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '🚫', title: 'No personal data', desc: 'Only field labels and context are processed — never your input.' },
                { emoji: '🔒', title: 'Encrypted in transit', desc: 'All data is encrypted using TLS. Nothing stored at rest.' },
                { emoji: '☁️', title: 'AWS Bedrock', desc: 'Enterprise-grade AI infrastructure with SOC 2 compliance.' },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 text-center">
                  <div className="text-xl mb-2">{item.emoji}</div>
                  <h3 className="text-[14px] font-bold text-[#0F172A] mb-1">{item.title}</h3>
                  <p className="text-[13px] text-[#64748B]">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-[#F8FAFF] py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mt-4 mb-4" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Simple, honest pricing.
            </h2>
            <p className="text-[17px] text-[#64748B] max-w-[580px] mx-auto mb-12">
              Every plan includes every feature. Only usage limits differ.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
            {/* Free */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55, delay: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 text-left flex flex-col"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Free</span>
              <div className="mt-2 mb-1"><span className="text-[40px] font-extrabold text-[#0F172A]">$0</span></div>
              <span className="text-[13px] text-[#64748B] border-b border-[#E2E8F0] pb-4 mb-4">per month</span>
              <div className="mb-1"><span className="text-[15px] font-bold text-[#0F172A]">1 form / month</span></div>
              <p className="text-[13px] text-[#64748B] mb-6">Try Fillyfy on one form session to see how it works.</p>
              <a href="#" className="mt-auto block text-center bg-[#F8FAFF] text-[#2563EB] border-[1.5px] border-[#BFDBFE] rounded-[9px] py-2.5 text-[14px] font-semibold hover:bg-[#EFF6FF] transition-colors">
                Get Started Free
              </a>
              <p className="text-[12px] text-[#94A3B8] text-center mt-3">All features included</p>
            </motion.div>

            {/* Starter */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55, delay: 0.1 }}
              className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 text-left flex flex-col"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Starter</span>
              <div className="mt-2 mb-1"><span className="text-[40px] font-extrabold text-[#0F172A]">$10</span></div>
              <span className="text-[13px] text-[#64748B] border-b border-[#E2E8F0] pb-4 mb-4">per month</span>
              <div className="mb-1"><span className="text-[15px] font-bold text-[#0F172A]">15 forms / month</span></div>
              <p className="text-[13px] text-[#64748B] mb-6">For regular form filing — immigration, taxes, applications.</p>
              <a href="#" className="mt-auto block text-center bg-[#F8FAFF] text-[#2563EB] border-[1.5px] border-[#BFDBFE] rounded-[9px] py-2.5 text-[14px] font-semibold hover:bg-[#EFF6FF] transition-colors">
                Get Starter
              </a>
              <p className="text-[12px] text-[#94A3B8] text-center mt-3">All features included</p>
            </motion.div>

            {/* Pro - Highlighted */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55, delay: 0.2 }}
              className="relative bg-[#2563EB] rounded-[20px] p-7 text-left flex flex-col"
            >
              <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] font-bold rounded-full px-3.5 py-1 whitespace-nowrap">
                Most Popular
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#93C5FD]">Pro</span>
              <div className="mt-2 mb-1"><span className="text-[40px] font-extrabold text-white">$20</span></div>
              <span className="text-[13px] text-[#93C5FD] border-b border-white/15 pb-4 mb-4">per month</span>
              <div className="mb-1"><span className="text-[15px] font-bold text-white">50 forms / month</span></div>
              <p className="text-[13px] text-[#93C5FD] mb-6">For power users tackling multiple complex applications.</p>
              <a href="#" className="mt-auto block text-center bg-white text-[#2563EB] rounded-[9px] py-2.5 text-[14px] font-bold hover:bg-[#F8FAFF] transition-colors">
                Get Pro
              </a>
              <p className="text-[12px] text-[#93C5FD] text-center mt-3">All features included</p>
            </motion.div>

            {/* Business */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55, delay: 0.3 }}
              className="bg-white border border-[#E2E8F0] rounded-[20px] p-7 text-left flex flex-col"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#94A3B8]">Business</span>
              <div className="mt-2 mb-1"><span className="text-[40px] font-extrabold text-[#0F172A]">$39</span></div>
              <span className="text-[13px] text-[#64748B] border-b border-[#E2E8F0] pb-4 mb-4">per month</span>
              <div className="mb-1"><span className="text-[15px] font-bold text-[#0F172A]">300 forms / month</span></div>
              <p className="text-[13px] text-[#64748B] mb-6">For teams and heavy usage — immigration offices, tax preparers.</p>
              <a href="#" className="mt-auto block text-center bg-[#F8FAFF] text-[#2563EB] border-[1.5px] border-[#BFDBFE] rounded-[9px] py-2.5 text-[14px] font-semibold hover:bg-[#EFF6FF] transition-colors">
                Get Business
              </a>
              <p className="text-[12px] text-[#94A3B8] text-center mt-3">All features included</p>
            </motion.div>
          </div>

          <p className="text-[13px] text-[#94A3B8] mt-8 text-center">
            One form session = one use, regardless of how many fields you click
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-[110px] px-6">
        <div className="max-w-[1080px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mb-12" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              People who no longer guess.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { name: 'Wei Zhang', role: 'International Student', initials: 'WZ', color: '#2563EB', quote: 'I was stuck on my DS-160 visa application for hours. Fillyfy explained "Port of Entry" in 2 seconds. Game changer for international students.' },
              { name: 'Priya Sharma', role: 'Founder @ Dataflow AI', initials: 'PS', color: '#7C3AED', quote: 'AWS Activate wanted my "Annual Recurring Revenue" — I wasn\'t sure if grants counted. Fillyfy clarified instantly. Got approved for $100k credits.' },
              { name: 'Carlos Rivera', role: 'Software Engineer', initials: 'CR', color: '#059669', quote: 'Green card application had 20+ confusing fields. Fillyfy saved me from hiring an immigration lawyer for basic form questions.' },
              { name: 'Sarah Mitchell', role: 'Registered Nurse', initials: 'SM', color: '#DC2626', quote: 'Insurance prior authorization forms are a nightmare. Fillyfy explains each field so I can submit correctly the first time.' },
              { name: 'Alex Kim', role: 'Freelance Designer', initials: 'AK', color: '#D97706', quote: 'Tax season used to give me anxiety. Now I just click confusing fields and actually understand what the IRS wants. Worth every penny.' },
              { name: 'Marcus Johnson', role: 'DevOps Lead', initials: 'MJ', color: '#0891B2', quote: 'Even AWS console forms can be cryptic. Fillyfy helps my team understand IAM policy fields without Googling every parameter.' },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                className="bg-[#F8FAFF] border border-[#E2E8F0] rounded-2xl p-7 text-left"
              >
                <div className="text-[14px] text-[#F59E0B] mb-3">★★★★★</div>
                <p className="text-[15px] text-[#374151] leading-[1.68] italic mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#0F172A]">{t.name}</div>
                    <div className="text-[12px] text-[#94A3B8]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#F8FAFF] py-[110px] px-6">
        <div className="max-w-[700px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <h2 className="font-display text-[#0F172A] leading-[1.1] font-normal mb-12" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Questions & answers.
            </h2>
          </motion.div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-[100px] px-6" style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)' }}>
        <div className="max-w-[680px] mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <h2 className="font-display text-white leading-[1.1] font-normal mb-5" style={{ fontSize: 'clamp(30px, 4vw, 44px)' }}>
              Start understanding every form today.
            </h2>
            <p className="text-[18px] text-[#93C5FD] leading-[1.65] mb-8">
              Free to install. No credit card required. Works on any website, any form, any field.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white text-[#2563EB] text-[16px] font-bold px-8 py-4 rounded-xl hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.14)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              Add to Chrome — Free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-11 px-6">
        <div className="max-w-[1080px] mx-auto flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="text-white text-[18px] font-extrabold">Fillyfy</span>
            <p className="text-[13px] text-[#475569] mt-1">Understand every form. Submit with confidence.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Features</a>
            <a href="#how-it-works" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">How it works</a>
            <a href="#pricing" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Pricing</a>
            <a href="#faq" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">FAQ</a>
            <a href="/privacy" className="text-[13px] text-[#64748B] hover:text-[#94A3B8] transition-colors">Privacy Policy</a>
          </div>
          <p className="text-[12px] text-[#334155]">© 2025 Fillyfy. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
