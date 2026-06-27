'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqItems = [
  {
    question: 'Does Fillyfy fill in my forms for me?',
    answer: 'No. Fillyfy never types, autofills, or submits anything. It only explains what a field is asking for — you stay in full control of what you enter.',
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-[700px] mx-auto">
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="border-t border-[#E2E8F0]"
          style={{ borderBottom: index === faqItems.length - 1 ? '1px solid #E2E8F0' : undefined }}
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
          >
            <span className="text-[16px] font-semibold text-[#0F172A] pr-4">{item.question}</span>
            <motion.svg
              animate={{ rotate: openIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ height: { duration: 0.35, ease: 'easeInOut' }, opacity: { duration: 0.25, ease: 'easeInOut' } }}
                className="overflow-hidden"
              >
                <p className="text-[15px] text-[#64748B] leading-[1.7] pb-5">
                  {item.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
