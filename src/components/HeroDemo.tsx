'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  type: string;
  url: string;
  title: string;
  subtitle: string;
  fields: { label: string; value: string; active: boolean }[];
  activeFieldIndex: number;
  sidebar: {
    fieldName: string;
    whatItMeans: string;
    whatToEnter: string;
    commonMistakes: string;
  };
  tip: string;
}

const scenarios: Scenario[] = [
  {
    type: 'Government Application',
    url: 'uscis.gov › forms › i-485 — Adjustment of Status',
    title: 'Form I-485',
    subtitle: 'Application to Register Permanent Residence',
    fields: [
      { label: 'Family Name', value: '', active: false },
      { label: 'Alien Registration Number', value: '', active: true },
      { label: 'Date of Birth', value: '', active: false },
    ],
    activeFieldIndex: 1,
    sidebar: {
      fieldName: 'Alien Registration Number',
      whatItMeans: 'A unique 7-9 digit identifier (A-Number) assigned by USCIS to track your immigration case.',
      whatToEnter: 'Enter the number from your EAD card, I-94, or prior USCIS notice. Format: A0XXXXXXX.',
      commonMistakes: 'Don\'t include the "A" prefix in the box. Leave blank if never assigned one.',
    },
    tip: '💡 Found on your EAD card or I-797 notice',
  },
  {
    type: 'Visa Application',
    url: 'ceac.state.gov › DS-160 — Nonimmigrant Visa',
    title: 'DS-160',
    subtitle: 'Online Nonimmigrant Visa Application',
    fields: [
      { label: 'Passport Number', value: '', active: false },
      { label: 'Port of Entry', value: '', active: true },
      { label: 'Length of Stay', value: '', active: false },
    ],
    activeFieldIndex: 1,
    sidebar: {
      fieldName: 'Port of Entry',
      whatItMeans: 'The U.S. airport or border crossing where you plan to first arrive in the United States.',
      whatToEnter: 'Select the city/airport closest to your destination. E.g., "JFK" or "LAX".',
      commonMistakes: 'Don\'t put your final destination city — put where your international flight first lands.',
    },
    tip: '💡 Usually your first landing airport in the US',
  },
  {
    type: 'AWS Activate',
    url: 'aws.amazon.com/activate › Application',
    title: 'AWS Activate',
    subtitle: 'Startup Credits Application',
    fields: [
      { label: 'Company Name', value: '', active: false },
      { label: 'Annual Recurring Revenue (ARR)', value: '', active: true },
      { label: 'Funding Stage', value: '', active: false },
    ],
    activeFieldIndex: 1,
    sidebar: {
      fieldName: 'Annual Recurring Revenue (ARR)',
      whatItMeans: 'The total yearly revenue from active subscriptions, normalized to an annual amount.',
      whatToEnter: 'Monthly recurring revenue × 12. Include only contracted, recurring revenue. Pre-revenue = $0.',
      commonMistakes: 'Don\'t include one-time payments or grants. Don\'t project future revenue.',
    },
    tip: '💡 MRR × 12 — only recurring subscription revenue',
  },
  {
    type: 'Tax Filing',
    url: 'irs.gov › e-file › Form 1040',
    title: 'Form 1040',
    subtitle: 'U.S. Individual Income Tax Return',
    fields: [
      { label: 'Filing Status', value: '', active: false },
      { label: 'Prior Year AGI', value: '', active: true },
      { label: 'Total Income', value: '', active: false },
    ],
    activeFieldIndex: 1,
    sidebar: {
      fieldName: 'Prior Year AGI',
      whatItMeans: 'Your Adjusted Gross Income from last year\'s tax return — used to verify your identity for e-filing.',
      whatToEnter: 'Find line 11 on your previous year\'s 1040. Enter the exact dollar amount shown.',
      commonMistakes: 'Don\'t use this year\'s income. If you didn\'t file last year, enter $0.',
    },
    tip: '💡 Line 11 of your previous year\'s 1040',
  },
  {
    type: 'University Admissions',
    url: 'studentaid.gov › FAFSA › Financial Info',
    title: 'FAFSA',
    subtitle: 'Free Application for Federal Student Aid',
    fields: [
      { label: 'Household Size', value: '', active: false },
      { label: 'Expected Family Contribution', value: '', active: true },
      { label: 'Student Income', value: '', active: false },
    ],
    activeFieldIndex: 1,
    sidebar: {
      fieldName: 'Expected Family Contribution',
      whatItMeans: 'An index number calculated from your FAFSA data that determines federal aid eligibility. It is NOT a bill.',
      whatToEnter: 'This is auto-calculated. If asked to confirm, find it on your Student Aid Report (SAR).',
      commonMistakes: 'Don\'t confuse this with what you\'ll actually pay. A lower EFC = more aid eligibility.',
    },
    tip: '💡 Found on your Student Aid Report (SAR)',
  },
];

export default function HeroDemo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'cursor' | 'field' | 'sidebar' | 'content' | 'fadeout'>('cursor');
  const [isVisible, setIsVisible] = useState(true);

  const advanceScenario = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % scenarios.length);
      setPhase('cursor');
      setIsVisible(true);
    }, 650);
  }, []);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    if (!isVisible) return;

    // Phase timeline
    timers.push(setTimeout(() => setPhase('field'), 350));
    timers.push(setTimeout(() => setPhase('sidebar'), 1300));
    timers.push(setTimeout(() => setPhase('content'), 1900));
    timers.push(setTimeout(() => advanceScenario(), 7200));

    return () => timers.forEach(clearTimeout);
  }, [currentIndex, isVisible, advanceScenario]);

  const scenario = scenarios[currentIndex];
  const showField = phase !== 'cursor';
  const showSidebar = phase === 'sidebar' || phase === 'content' || phase === 'fadeout';
  const showContent = phase === 'content' || phase === 'fadeout';

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-full rounded-[14px] overflow-hidden"
        style={{
          boxShadow: '0 24px 64px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06)',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Browser Chrome */}
        <div className="h-[38px] bg-[#1E293B] flex items-center px-3 gap-3">
          <div className="flex gap-[6px]">
            <div className="w-[11px] h-[11px] rounded-full bg-[#FF5F57]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#FFBD2E]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 bg-[#334155] rounded h-5 flex items-center px-3">
            <span className="text-[10px] font-mono text-[#94A3B8] truncate">
              {scenario.url}
            </span>
          </div>
          <div className="w-5 h-5 bg-[#2563EB] rounded flex items-center justify-center">
            <span className="text-white text-[9px] font-extrabold">F</span>
          </div>
        </div>

        {/* Browser Content */}
        <div className="relative flex bg-[#F1F5F9] min-h-[340px]">
          {/* Form Panel */}
          <div className="flex-1 bg-white p-[20px_18px] flex flex-col">
            <div className="border-b border-[#E2E8F0] pb-2 mb-4">
              <div className="text-[13px] font-bold text-[#0F172A]">{scenario.title}</div>
              <div className="text-[10px] text-[#94A3B8]">{scenario.subtitle}</div>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {scenario.fields.map((field, i) => {
                const isActive = i === scenario.activeFieldIndex && showField;
                return (
                  <div key={i}>
                    <label
                      className="block text-[9px] font-bold uppercase tracking-[0.07em] mb-1 transition-colors duration-300"
                      style={{ color: isActive ? '#1D4ED8' : '#94A3B8' }}
                    >
                      {field.label}
                    </label>
                    <div
                      className="rounded-[6px] px-[10px] py-2 text-[11px] transition-all duration-[350ms]"
                      style={{
                        border: isActive ? '1.5px solid #2563EB' : '1.5px solid #E2E8F0',
                        background: isActive ? '#EFF6FF' : '#FAFAFA',
                        boxShadow: isActive ? '0 0 0 3px rgba(37,99,235,0.14)' : 'none',
                      }}
                    >
                      <span className="text-[#94A3B8]">{field.value || '\u00A0'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 bg-[#F0F9FF] border border-[#BAE6FD] rounded-[6px] px-3 py-2">
              <span className="text-[10px] font-semibold text-[#0369A1]">{scenario.tip}</span>
            </div>
          </div>

          {/* Fillyfy Sidebar */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[208px] bg-white border-l border-[#E2E8F0] flex flex-col transition-transform duration-[450ms]"
            style={{
              transform: showSidebar ? 'translateX(0%)' : 'translateX(102%)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '-6px 0 24px rgba(0,0,0,0.09)',
            }}
          >
            {/* Sidebar Header */}
            <div className="bg-[#2563EB] px-3 py-[9px] flex items-center gap-2">
              <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-extrabold">F</span>
              </div>
              <span className="text-white text-[11px] font-bold">Fillyfy</span>
              <span className="ml-auto text-[#93C5FD] text-[9px]">Field Explained</span>
            </div>

            {/* Sidebar Content */}
            <div
              className="flex-1 overflow-y-auto p-3 transition-opacity duration-500"
              style={{ opacity: showContent ? 1 : 0 }}
            >
              <div className="text-[12px] font-bold text-[#0F172A] mb-3">
                {scenario.sidebar.fieldName}
              </div>

              <div className="border-t border-[#F1F5F9] pt-2 mb-3">
                <div className="text-[9px] font-bold uppercase text-[#2563EB] mb-1">📌 What it means</div>
                <div className="text-[10.5px] text-[#374151] leading-[1.55]">
                  {scenario.sidebar.whatItMeans}
                </div>
              </div>

              <div className="border-t border-[#F1F5F9] pt-2 mb-3">
                <div className="text-[9px] font-bold uppercase text-[#16A34A] mb-1">✅ What to enter</div>
                <div className="text-[10.5px] text-[#374151] leading-[1.55]">
                  {scenario.sidebar.whatToEnter}
                </div>
              </div>

              <div className="border-t border-[#F1F5F9] pt-2">
                <div className="text-[9px] font-bold uppercase text-[#D97706] mb-1">⚠️ Common mistakes</div>
                <div className="text-[10.5px] text-[#374151] leading-[1.55]">
                  {scenario.sidebar.commonMistakes}
                </div>
              </div>
            </div>
          </div>

          {/* Animated Cursor */}
          <motion.div
            className="absolute pointer-events-none z-20"
            animate={{
              left: showField ? '44%' : '15%',
              top: showField ? '33%' : '73%',
              scale: phase === 'field' ? 0.82 : 1,
            }}
            transition={{
              left: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              top: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.15, ease: 'easeOut' },
            }}
          >
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
              <path d="M4 0L4 18L8.5 14L12 21L15 19.5L11.5 12.5L17 12L4 0Z" fill="white" stroke="#0F172A" strokeWidth="1.5" />
            </svg>
          </motion.div>
        </div>

        {/* Scenario Dots */}
        <div className="bg-[#1E293B] py-[9px] flex justify-center gap-2">
          {scenarios.map((_, i) => (
            <div
              key={i}
              className="h-[6px] rounded-[3px] transition-all duration-400"
              style={{
                width: i === currentIndex ? '18px' : '6px',
                background: i === currentIndex ? '#2563EB' : '#4B5563',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Demo Label */}
      <div className="mt-4 text-[12px] text-[#94A3B8]">
        Showing: <span className="text-[#2563EB] font-semibold">{scenario.type}</span>
      </div>
    </div>
  );
}
