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
      style={{
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        padding: '5px 14px',
        borderRadius: '100px',
        marginBottom: '18px',
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.text,
      }}
    >
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      <Nav />

      {/* Hero Section */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'radial-gradient(ellipse 70% 60% at 72% 5%, rgba(37,99,235,0.07) 0%, transparent 65%), #fff',
          padding: '88px 24px 60px',
        }}
      >
        <div style={{
          maxWidth: '1160px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '56px',
          flexWrap: 'wrap' as const,
        }}>
          {/* Left Column */}
          <div style={{ flex: 1, minWidth: '320px', maxWidth: '540px' }}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '100px',
                padding: '5px 14px',
                marginBottom: '26px',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563EB', animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563EB' }}>Now available — free to install</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.1 }}
              className="font-display"
              style={{
                fontSize: 'clamp(42px, 5.5vw, 64px)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                color: '#0D1B2A',
                marginBottom: '22px',
                fontWeight: 400,
              }}
            >
              Never wonder what a form is asking again.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.2 }}
              style={{
                fontSize: '17px',
                lineHeight: 1.72,
                color: '#64748B',
                marginBottom: '36px',
                maxWidth: '480px',
              }}
            >
              Click any form field. Fillyfy instantly explains what it means, what to enter, common mistakes, and what documents you may need — without leaving the page.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.55, delay: 0.3 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' as const, marginBottom: '36px' }}
            >
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#2563EB',
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '13px 24px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(37,99,235,0.28)',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><circle cx="8.5" cy="8.5" r="8.5" fill="rgba(255,255,255,0.18)"/><circle cx="8.5" cy="8.5" r="3.5" fill="white"/></svg>
                Add to Chrome — Free
              </a>
              <a
                href="#demo"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#374151',
                  fontSize: '15px',
                  fontWeight: 600,
                  padding: '13px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  border: '1.5px solid #E2E8F0',
                  background: 'white',
                  transition: 'all 0.2s',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#374151" strokeWidth="1.5"/><path d="M6.5 5.8l4 2.2-4 2.2V5.8z" fill="#374151"/></svg>
                Watch 30s demo
              </a>
            </motion.div>


          </div>

          {/* Right Column - Demo */}
          <div id="demo" style={{ flex: 1, minWidth: '460px', maxWidth: '580px' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <HeroDemo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{ padding: '28px 24px', background: '#F8FAFF', borderTop: '1px solid #EFF6FF', borderBottom: '1px solid #EFF6FF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '22px' }}>
            Trusted infrastructure — built for privacy and scale
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '44px', flexWrap: 'wrap' as const }}>
            {[
              { label: 'Chrome Web Store', icon: <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="#4285F4"/><circle cx="9" cy="9" r="3.5" fill="white"/></svg> },
              { label: 'AWS Bedrock', icon: <svg width="30" height="18" viewBox="0 0 30 18"><rect width="30" height="18" rx="3" fill="#FF9900"/><text x="3" y="13" fontFamily="Arial" fontSize="9" fontWeight="800" fill="white">AWS</text></svg> },
              { label: 'Claude AI', icon: <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="9" fill="#D97B4F"/></svg> },
              { label: 'Clerk Auth', icon: <svg width="18" height="18" viewBox="0 0 18 18"><rect width="18" height="18" rx="4" fill="#6C47FF"/></svg> },
              { label: 'Privacy First', icon: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 1.5L2 5v5.5C2 14.4 5.2 17.3 9 18c3.8-.7 7-3.6 7-7.5V5L9 1.5z" fill="none" stroke="#16A34A" strokeWidth="1.5"/><path d="M6 9.5l2.5 2.5 4-4" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/></svg> },
              { label: 'E2E Encrypted', icon: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="8" width="12" height="9" rx="2" stroke="#64748B" strokeWidth="1.5" fill="none"/><path d="M6 8V6.5a3 3 0 016 0V8" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg> },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6 }}>
                {item.icon}
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" style={{ padding: '110px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <SectionLabel color="red">The problem</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.1, color: '#0F172A', marginBottom: '18px' }}>
              You&apos;re in the middle of something important.<br/>And you&apos;re stuck.
            </h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}>
              A visa application. A bank account. A startup grant. You reach a field you&apos;ve never seen before — and the guessing begins.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '56px' }}>
            {[
              { emoji: '😕', title: 'Confusing field names', body: '"Alien Registration Number." "Port of Entry." "Prior Year AGI." These terms appear with no explanation, no context, no guidance.', bg: '#FEF2F2', border: '#FECACA', titleColor: '#991B1B', bodyColor: '#7F1D1D' },
              { emoji: '🔍', title: 'Five tabs. No clear answer.', body: 'You Google it. You paste it into ChatGPT. Four tabs open. None of the answers clearly apply to your specific form or situation.', bg: '#FFFBEB', border: '#FDE68A', titleColor: '#92400E', bodyColor: '#78350F' },
              { emoji: '🤞', title: 'You guess and hope', body: 'You submit unsure if you got it right. A mistake could mean delays, rejections, or starting the entire process over.', bg: '#F0FDF4', border: '#BBF7D0', titleColor: '#166534', bodyColor: '#14532D' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ background: card.bg, border: `1px solid ${card.border}`, borderRadius: '16px', padding: '28px' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{card.emoji}</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: card.titleColor, marginBottom: '10px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: card.bodyColor, lineHeight: 1.65 }}>{card.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '15px 36px', background: '#EFF6FF', borderRadius: '100px', fontSize: '16px', fontWeight: 600, color: '#2563EB' }}>
              There&apos;s a better way →
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '110px 24px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '72px' }}>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A' }}>
              Three steps. No learning curve.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { emoji: '🌐', step: 'Step 01', title: 'Open any form', body: 'Navigate to any website — government, banking, startup programs. Fillyfy detects the form and quietly activates.' },
              { emoji: '👆', step: 'Step 02', title: 'Click a confusing field', body: 'See something unfamiliar? Just click it. No commands, no searching, no copy-paste. One click is the entire interaction.' },
              { emoji: '✨', step: 'Step 03', title: 'Understand instantly', body: 'A sidebar opens beside the form. What it means, what to enter, common mistakes, documents needed. Fill in with confidence.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ width: '56px', height: '56px', background: '#2563EB', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', fontSize: '22px', boxShadow: '0 4px 18px rgba(37,99,235,0.26)' }}>
                  {item.emoji}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: '10px' }}>{item.step}</div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.68 }}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="examples" style={{ padding: '110px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>Works everywhere</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A', marginBottom: '14px' }}>
              Any form. Any website.
            </h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
              Fillyfy is intentionally universal. Here&apos;s where people use it most.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[
              { emoji: '🏛️', title: 'Government Applications', desc: 'USCIS, SSA, IRS, and federal portals — decoded field by field.' },
              { emoji: '🌍', title: 'Visa & Immigration', desc: 'Know exactly what each consular field requires before you submit.' },
              { emoji: '🚀', title: 'Startup Funding', desc: 'AWS Activate, accelerators, grants — apply with full confidence.' },
              { emoji: '🏦', title: 'Banking & Finance', desc: 'Open accounts and complete financial applications accurately.' },
              { emoji: '📋', title: 'Tax Filing', desc: 'Decode IRS terminology. File accurately every time.' },
              { emoji: '🎓', title: 'University Admissions', desc: 'Navigate FAFSA, scholarship, and admissions forms.' },
              { emoji: '🏥', title: 'Healthcare', desc: 'Insurance claims, patient intake, medical billing — clarified.' },
              { emoji: '☁️', title: 'Cloud & Enterprise', desc: 'AWS, GCP, Azure consoles and enterprise admin portals.' },
              { emoji: '🏪', title: 'Business Registration', desc: 'Start your business right — from the very first form field.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.05 }}
                style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '22px', transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '24px', marginBottom: '10px' }}>{card.emoji}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>{card.title}</div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{card.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '110px 24px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>Features</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A' }}>
              Everything you need. Nothing you don&apos;t.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { emoji: '💡', title: 'Instant Field Explanations', body: 'Click any field. Get a plain-language explanation in seconds — without leaving the page.' },
              { emoji: '📄', title: 'Document Guidance', body: 'Know which documents you\'ll need before you get stuck. No surprises, no backtracking mid-application.' },
              { emoji: '🧠', title: 'Context-Aware Analysis', body: 'Reads full page context — not just the label — so explanations are accurate and specific to the form you\'re on.' },
              { emoji: '🛡️', title: 'Mistake Prevention', body: 'Common errors surfaced before you make them. Catch problems before they cause delays or rejections.' },
              { emoji: '🌐', title: 'Works Everywhere', body: 'Government, banking, tax, visa, cloud platforms, enterprise software. Any form field. Any website.' },
              { emoji: '🔒', title: 'Privacy by Design', body: 'Only field metadata is sent — label, placeholder, context. Your actual answers stay on your screen. Always.' },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px', transition: 'all 0.2s' }}
              >
                <div style={{ width: '44px', height: '44px', background: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
                  {card.emoji}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>{card.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65 }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55 }}
            style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)', border: '1px solid #BFDBFE', borderRadius: '24px', padding: '56px 60px', textAlign: 'center' }}
          >
            <div style={{ fontSize: '40px', marginBottom: '18px' }}>🔐</div>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#0F172A', marginBottom: '14px' }}>
              Your data never leaves the field.
            </h2>
            <p style={{ fontSize: '17px', color: '#64748B', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              Fillyfy never reads, stores, or transmits what you type. Only the field&apos;s label, placeholder, and surrounding page context are analyzed — never your actual answers.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', textAlign: 'left' }}>
              {[
                { emoji: '🚫', title: 'No personal data', desc: 'Your form answers are never read or transmitted. Ever.' },
                { emoji: '🔒', title: 'Encrypted in transit', desc: 'All communication uses enterprise-grade TLS encryption.' },
                { emoji: '☁️', title: 'AWS Bedrock', desc: 'Enterprise AI infrastructure with strict privacy and compliance standards.' },
              ].map((item, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '18px', marginBottom: '8px' }}>{item.emoji}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '110px 24px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A', marginBottom: '14px' }}>
              Simple, honest pricing.
            </h2>
            <p style={{ fontSize: '17px', color: '#64748B' }}>Every plan includes every feature. Only usage limits differ.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {/* Free */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>Free</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', lineHeight: 1, marginBottom: '4px' }}>$0</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid #E2E8F0' }}>per month</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>1 form / month</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '26px' }}>Try it out</div>
              <a href="#" style={{ display: 'block', textAlign: 'center', background: '#F8FAFF', color: '#2563EB', fontSize: '14px', fontWeight: 600, padding: '11px', borderRadius: '9px', textDecoration: 'none', border: '1.5px solid #BFDBFE', transition: 'all 0.2s' }}>Get started free</a>
              <div style={{ marginTop: '18px', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>All features included</div>
            </div>

            {/* Starter */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>Starter</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', lineHeight: 1, marginBottom: '4px' }}>$10</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid #E2E8F0' }}>per month</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>15 forms / month</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '26px' }}>Regular users</div>
              <a href="#" style={{ display: 'block', textAlign: 'center', background: '#F8FAFF', color: '#2563EB', fontSize: '14px', fontWeight: 600, padding: '11px', borderRadius: '9px', textDecoration: 'none', border: '1.5px solid #BFDBFE', transition: 'all 0.2s' }}>Get Starter</a>
              <div style={{ marginTop: '18px', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>All features included</div>
            </div>

            {/* Pro - Highlighted */}
            <div style={{ background: '#2563EB', border: '1px solid #2563EB', borderRadius: '20px', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#0F172A', color: 'white', fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>Most popular</div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: '10px' }}>Pro</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: '4px' }}>$20</div>
              <div style={{ fontSize: '13px', color: '#93C5FD', marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>per month</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '5px' }}>50 forms / month</div>
              <div style={{ fontSize: '13px', color: '#93C5FD', marginBottom: '26px' }}>Power users</div>
              <a href="#" style={{ display: 'block', textAlign: 'center', background: 'white', color: '#2563EB', fontSize: '14px', fontWeight: 700, padding: '11px', borderRadius: '9px', textDecoration: 'none', transition: 'all 0.2s' }}>Get Pro</a>
              <div style={{ marginTop: '18px', fontSize: '12px', color: '#93C5FD', textAlign: 'center' }}>All features included</div>
            </div>

            {/* Business */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '10px' }}>Business</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color: '#0F172A', lineHeight: 1, marginBottom: '4px' }}>$39</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px', paddingBottom: '22px', borderBottom: '1px solid #E2E8F0' }}>per month</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '5px' }}>300 forms / month</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '26px' }}>Teams &amp; heavy users</div>
              <a href="#" style={{ display: 'block', textAlign: 'center', background: '#F8FAFF', color: '#2563EB', fontSize: '14px', fontWeight: 600, padding: '11px', borderRadius: '9px', textDecoration: 'none', border: '1.5px solid #BFDBFE', transition: 'all 0.2s' }}>Get Business</a>
              <div style={{ marginTop: '18px', fontSize: '12px', color: '#94A3B8', textAlign: 'center' }}>All features included</div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#94A3B8' }}>
            One form session = one use, regardless of how many fields you click
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '110px 24px', background: 'white' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }} style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A' }}>
              People who no longer guess.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { initials: 'WZ', name: 'Wei Zhang', role: 'International Student, China', color: '#DBEAFE', textColor: '#2563EB', quote: '"I was applying for my student visa and had no idea what \'Port of Entry\' meant. Fillyfy explained it in seconds. I submitted the form correctly and was approved."' },
              { initials: 'PS', name: 'Priya Sharma', role: 'Founder, Dataflow AI', color: '#DCFCE7', textColor: '#16A34A', quote: '"Used it for our AWS Activate application. The ARR field explanation alone saved us from a critical mistake. We got approved for $100K in credits."' },
              { initials: 'CR', name: 'Carlos Rivera', role: 'Software Engineer, Mexico', color: '#FEF9C3', textColor: '#CA8A04', quote: '"English isn\'t my first language and government forms were always stressful. Fillyfy explains everything in plain language. I actually understand what I\'m submitting now."' },
              { initials: 'SM', name: 'Sarah Mitchell', role: 'Registered Nurse', color: '#FCE7F3', textColor: '#BE185D', quote: '"Used it for a healthcare insurance claim. The document guidance was exactly what I needed — it told me which forms to attach before I even thought to ask."' },
              { initials: 'AK', name: 'Alex Kim', role: 'Freelance Designer', color: '#EDE9FE', textColor: '#7C3AED', quote: '"Filing taxes as self-employed for the first time was terrifying. Fillyfy explained every confusing IRS field. I filed accurately and on time. Worth every penny."' },
              { initials: 'MJ', name: 'Marcus Johnson', role: 'DevOps Lead', color: '#DBEAFE', textColor: '#1D4ED8', quote: '"I use it for onboarding our team to new cloud platforms. Enterprise admin portals are notoriously confusing. Fillyfy makes every configuration field make sense."' },
            ].map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                style={{ background: '#F8FAFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '28px' }}
              >
                <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}><span style={{ color: '#F59E0B', fontSize: '14px' }}>★★★★★</span></div>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.68, marginBottom: '20px' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: t.textColor, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '110px 24px', background: '#F8FAFF' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.1, color: '#0F172A', marginBottom: '56px' }}>
              Questions &amp; answers.
            </h2>
          </motion.div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%)' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.55 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(34px, 5vw, 54px)', lineHeight: 1.08, color: 'white', marginBottom: '18px' }}>
              Start understanding every form today.
            </h2>
            <p style={{ fontSize: '18px', color: '#93C5FD', marginBottom: '40px', lineHeight: 1.65 }}>
              Free to install. No credit card required.<br/>Works on any website, any form, any field.
            </p>
            <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'white', color: '#2563EB', fontSize: '16px', fontWeight: 700, padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 24px rgba(0,0,0,0.14)' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="9" fill="rgba(37,99,235,0.15)"/><circle cx="9" cy="9" r="3.5" fill="#2563EB"/></svg>
              Add to Chrome — Free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F172A', padding: '44px 24px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <img src="/logo.png" alt="Fillyfy" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>Fillyfy</span>
            </div>
            <div style={{ fontSize: '13px', color: '#475569' }}>Understand every form. Submit with confidence.</div>
          </div>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' as const }}>
            <a href="#features" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>Features</a>
            <a href="#how-it-works" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>How it works</a>
            <a href="#pricing" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>Pricing</a>
            <a href="#faq" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>FAQ</a>
            <a href="/privacy" style={{ fontSize: '13px', color: '#64748B', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</a>
          </div>
          <div style={{ fontSize: '12px', color: '#334155' }}>© 2025 Fillyfy. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
