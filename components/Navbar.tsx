'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Sixtyfour } from 'next/font/google';

const sixtyfour = Sixtyfour({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const navLinks = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'project', href: '/projects' },
];

// Individual Nav Button Component
function NavButton({ href, labelKey, t, onClick }: { href: string; labelKey: string; t: (key: string) => string; onClick?: () => void }) {
  const label = t(`nav.${labelKey}`);
  return (
    <Link
      href={href}
      onClick={onClick}
      className="nav-button-slide block rounded-full px-4 md:px-5 py-2.5 text-xs md:text-sm font-bold uppercase whitespace-nowrap bg-gray-800/95 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
      aria-label={label}
    >
      {/* Hover effect - brand yellow button slides up from bottom to replace */}
      <div className="nav-slide-bg" />
      {/* Default white text - moves up and fades out on hover */}
      <span className="nav-text-white block text-center text-white">
        {label}
      </span>
      {/* Black text that slides up with the yellow background button */}
      <span className="nav-text-black font-bold uppercase">
        {label}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const isRTL = language === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
      
      // At the very top, always show
      if (currentScrollY < 10) {
        setIsExpanded(true);
        lastScrollY.current = currentScrollY;
      } else if (scrollDifference > 5) {
        // Only update state if scrolled more than 5px to allow smooth animation
        // Check scroll direction
        if (currentScrollY > lastScrollY.current) {
          // Scrolling down - collapse
          setIsExpanded(false);
        } else if (currentScrollY < lastScrollY.current) {
          // Scrolling up - expand
          setIsExpanded(true);
        }
      }
      
      // Always update last scroll position
      lastScrollY.current = currentScrollY;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Close mobile menu on ESC key
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        // Return focus to menu button
        const menuButton = document.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement;
        if (menuButton) {
          menuButton.focus();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      dir={isRTL ? 'rtl' : 'ltr'}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300 safe-area-top"
      style={{ 
        height: 'clamp(60px, 8vw, 82px)', 
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.25rem)',
        opacity: isExpanded ? 1 : 0.8,
        transform: isExpanded ? 'translateY(0)' : 'translateY(100%)'
      }}
    >
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isExpanded ? 'space-between' : 'center',
        gap: isExpanded ? '0' : '20px'
      }}>
        {/* Collapsed container with blur */}
        {!isExpanded && (
          <div
            className="flex items-center gap-6 px-6 py-3 rounded-full transition-all duration-300"
            style={{
              backdropFilter: 'blur(80px)',
              WebkitBackdropFilter: 'blur(80px)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              marginTop: '-140px',
            }}
          >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link 
                href="/" 
                className={`text-white text-lg sm:text-xl md:text-2xl font-normal uppercase tracking-[clamp(0.2em, 0.5vw, 0.32em)] leading-[1.2] hover:opacity-80 transition-opacity z-10 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2 rounded ${sixtyfour.className}`}
                aria-label="ALMOHTAREF - Home"
              >
                ALMOHTAREF
              </Link>
            </div>

            {/* CALL Button */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              position: 'relative',
              zIndex: 20
            }}>
              <Link
                href="/contact"
                className="relative flex items-center group focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2 rounded-full"
                style={{ zIndex: 20 }}
                aria-label={t('nav.call')}
              >
                {/* Call button with white bg/yellow outline; hover flips to yellow bg/white outline */}
                <div className="bg-white hover:bg-[#FFDD00] text-black pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-2.5 rounded-full flex items-center gap-1.5 border border-[#FFDD00] hover:border-white transition-colors transition-transform duration-200 group-hover:scale-[1.02]">
                  <span className="text-xs font-bold uppercase tracking-wide">{t('nav.call')}</span>
                  {/* Accent circle with arrow */}
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-[#FFDD00] group-hover:bg-white rounded-full flex items-center justify-center border-2 border-white flex-shrink-0 transition-transform duration-200 group-hover:rotate-10 group-hover:scale-[1.05] text-white group-hover:text-[#FFDD00]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-200 group-hover:rotate-45"
                      style={{ transformOrigin: 'center' }}
                    >
                      <path
                        d="M1 9L9 1M9 1H1M9 1V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Expanded layout */}
        {isExpanded && (
          <>
            {/* Logo and Language Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              <Link 
                href="/" 
                className={`text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal uppercase tracking-[clamp(0.2em, 0.5vw, 0.32em)] leading-[1.2] hover:opacity-80 transition-opacity z-10 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2 rounded ${sixtyfour.className}`}
                aria-label="ALMOHTAREF - Home"
              >
                ALMOHTAREF
              </Link>
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div 
              className="hidden lg:flex items-center gap-2 md:gap-3" 
              style={{ 
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10 
              }}
            >
              {navLinks.map((link) => (
                <NavButton
                  key={link.key}
                  href={link.href}
                  labelKey={link.key}
                  t={t}
                />
              ))}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg bg-gray-800/95 hover:bg-gray-700/95 transition-colors z-30 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* CALL Button - Desktop */}
            <div className="hidden lg:flex items-center relative z-20">
              <Link
                href="/contact"
                className="relative flex items-center group focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2 rounded-full"
                aria-label={t('nav.call')}
              >
                {/* Call button with white bg/yellow outline; hover flips to yellow bg/white outline */}
                <div className="bg-white hover:bg-[#FFDD00] text-black pl-3 md:pl-4 pr-3 md:pr-4 py-2 md:py-2.5 rounded-full flex items-center gap-1.5 border border-[#FFDD00] hover:border-white transition-colors transition-transform duration-200 group-hover:scale-[1.02]">
                  <span className="text-xs font-bold uppercase tracking-wide">{t('nav.call')}</span>
                  {/* Accent circle with arrow */}
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-[#FFDD00] group-hover:bg-white rounded-full flex items-center justify-center border-2 border-white flex-shrink-0 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-[1.05] text-white group-hover:text-[#FFDD00]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="transition-transform duration-200 group-hover:rotate-45"
                      style={{ transformOrigin: 'center' }}
                    >
                      <path
                        d="M1 9L9 1M9 1H1M9 1V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && isExpanded && (
        <div 
          id="mobile-menu"
          className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-lg z-40 safe-area-top" 
          style={{ top: 'clamp(60px, 8vw, 82px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 safe-area-left safe-area-right">
            <div className="flex flex-col items-center justify-start pt-8">
              {/* Container for navigation buttons */}
              <div className="w-full max-w-md bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/20">
                <h2 id="mobile-menu-title" className="sr-only">Navigation Menu</h2>
                {/* Language Switcher for Mobile */}
                <div className="md:hidden flex justify-center pb-2">
                  <LanguageSwitcher />
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="flex flex-col items-center gap-3">
                  {navLinks.map((link) => (
                    <NavButton
                      key={link.key}
                      href={link.href}
                      labelKey={link.key}
                      t={t}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                </div>
                
                {/* Mobile CALL Button */}
                <div className="flex justify-center pt-2">
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative flex items-center group focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2 rounded-full"
                    aria-label={t('nav.call')}
                  >
                    <div className="bg-white hover:bg-[#FFDD00] text-black pl-4 pr-4 py-2.5 rounded-full flex items-center gap-1.5 border border-[#FFDD00] hover:border-white transition-colors transition-transform duration-200 group-hover:scale-[1.02]">
                      <span className="text-xs font-bold uppercase tracking-wide">{t('nav.call')}</span>
                      <div className="w-7 h-7 bg-[#FFDD00] group-hover:bg-white rounded-full flex items-center justify-center border-2 border-white flex-shrink-0 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-[1.05] text-white group-hover:text-[#FFDD00]">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="transition-transform duration-200 group-hover:rotate-45"
                          style={{ transformOrigin: 'center' }}
                        >
                          <path
                            d="M1 9L9 1M9 1H1M9 1V9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
