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
      className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        background: isScrolled ? 'rgba(255,255,255,0.94)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(14px)' : 'none',
        boxShadow: isScrolled ? '0 1px 20px rgba(0,0,0,0.06)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', gap: '36px', width: '100%' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <img src="/logo.png" alt="Fillyfy" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
          <span style={{ fontSize: '19px', fontWeight: 800, color: '#2563EB', letterSpacing: '-0.03em' }}>Fillyfy</span>
        </a>

        <div className="hidden md:flex" style={{ flex: 1, alignItems: 'center', gap: '32px' }}>
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
          style={{ flexShrink: 0, background: '#2563EB', color: 'white', fontSize: '14px', fontWeight: 600, padding: '9px 20px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.2s' }}
        >
          Add to Chrome
        </a>
      </div>
    </nav>
  );
}
