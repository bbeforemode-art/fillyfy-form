'use client';

import { useState } from 'react';

const faqItems = [
  {
    question: 'Does Fillyfy fill in my forms for me?',
    answer: 'No. Fillyfy never fills, edits, or submits any form. It only explains what each field means. You stay fully in control of everything you type.',
  },
  {
    question: 'Is my data stored or used for AI training?',
    answer: 'No. Field context is processed in real-time and never stored permanently. We never use your data to train AI models. Your information is encrypted in transit and discarded after the explanation is generated.',
  },
  {
    question: 'Does it work on government websites?',
    answer: 'Yes. Fillyfy works on USCIS, IRS, state.gov, studentaid.gov, and virtually all government form websites. It reads the form structure without interfering with the site.',
  },
  {
    question: 'Can I use it for AWS Activate or startup applications?',
    answer: 'Absolutely. Fillyfy is particularly helpful for complex startup applications like AWS Activate, Y Combinator, and other funding forms where fields like "ARR" or "burn rate" need context.',
  },
  {
    question: 'How does a "form session" work?',
    answer: 'One form session = one use. When you open a form and click fields for explanations, that counts as one session — regardless of how many fields you click on that form. Navigating to a different form starts a new session.',
  },
  {
    question: 'What AI powers Fillyfy?',
    answer: 'Fillyfy uses Claude AI (via AWS Bedrock) for generating explanations. This ensures fast, accurate, and contextually aware responses while maintaining enterprise-grade security.',
  },
  {
    question: 'Is it available outside the United States?',
    answer: 'Yes. Fillyfy works globally on any website in any language. The explanations are generated in English, with multi-language support coming soon.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      {faqItems.map((item, index) => (
        <div
          key={index}
          style={{
            borderTop: '1px solid #E2E8F0',
            borderBottom: index === faqItems.length - 1 ? '1px solid #E2E8F0' : undefined,
          }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#0F172A', paddingRight: '16px' }}>
              {item.question}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                flexShrink: 0,
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            style={{
              overflow: 'hidden',
              maxHeight: openIndex === index ? '300px' : '0px',
              opacity: openIndex === index ? 1 : 0,
              transition: 'max-height 0.35s ease, opacity 0.25s ease',
            }}
          >
            <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, paddingBottom: '20px' }}>
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
