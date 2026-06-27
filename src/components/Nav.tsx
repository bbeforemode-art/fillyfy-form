'use client';

import { useState, useEffect } from 'react';

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[100] h-[60px] flex items-center transition-all duration-300"
      style={{
        background: isScrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(14px)' : 'none',
        boxShadow: isScrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div className="w-full max-w-[1160px] mx-auto px-6 flex items-center justify-between">
        <a href="#" className="font-body text-[19px] font-extrabold text-[#2563EB] tracking-[-0.03em]">
          Fillyfy
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap">
            Features
          </a>
          <a href="#how-it-works" className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap">
            How it works
          </a>
          <a href="#pricing" className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap">
            Pricing
          </a>
          <a href="#faq" className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors whitespace-nowrap">
            FAQ
          </a>
        </div>

        <a
          href="#"
          className="bg-[#2563EB] text-white text-[14px] font-semibold px-5 py-[9px] rounded-lg hover:bg-[#1D4ED8] transition-colors"
        >
          Add to Chrome
        </a>
      </div>
    </nav>
  );
}
