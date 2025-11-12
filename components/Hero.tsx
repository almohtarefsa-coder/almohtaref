'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sixtyfour } from 'next/font/google';

const sixtyfour = Sixtyfour({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sixtyfour',
});


export default function Hero() {
  const { t } = useLanguage();
  const [showFullSentence, setShowFullSentence] = useState(true);

  useEffect(() => {
    const toggle = setInterval(() => {
      setShowFullSentence((prev) => !prev);
    }, 2600);
    return () => clearInterval(toggle);
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-black ${sixtyfour.variable}`}>
      <Image
        src="/banner.webp"
        alt="Concrete architecture background"
        fill
        priority
        className="absolute inset-0 object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 w-full max-w-[min(1200px,90vw)] px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 text-center safe-area-left safe-area-right">
        <div className="min-h-[2.2rem] md:min-h-[2.6rem] flex items-center mt-8">
          <AnimatePresence mode="wait">
            {showFullSentence ? (
              <motion.p
                key="full-sentence"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="text-black text-sm md:text-lg tracking-[0.18em] font-semibold"
              >
                {t('hero.tagline')}
              </motion.p>
            ) : (
              <motion.div
                key="alt-sentence"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative inline-flex h-[1.6em] md:h-[1.8em] items-center justify-center overflow-hidden"
              >
                <span className="text-black text-base md:text-lg font-bold tracking-[0.25em]">
                  {t('hero.taglineAlt')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-4xl"
        >
          <div className="relative rounded-[clamp(24px,4vw,48px)] border border-white/40 bg-white/[0.08] backdrop-blur-2xl px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] w-full">
            <div className="pointer-events-none absolute inset-[10px] rounded-[40px] border border-white/20" />
            <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <span
                  data-font="sixtyfour"
                  className={`${sixtyfour.variable} ${sixtyfour.className} hero-almohtaref-banner`}
                  style={{ 
                    display: 'block',
                    fontSize: 'clamp(2rem, 8vw, 4.5rem)',
                    textTransform: 'uppercase',
                    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))',
                    fontFamily: 'var(--font-sixtyfour), "Sixtyfour", "Sixtyfour Variable", system-ui, -apple-system, sans-serif',
                    fontWeight: '400',
                    color: '#FFDD00',
                    lineHeight: '1.1',
                    whiteSpace: 'nowrap'
                  }}
                >
                  ALMOHTAREF
                </span>
                <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <span className="mt-5 block text-xs md:text-sm tracking-[0.6em] uppercase text-white">
                  {t('hero.alwaysReady')}
                </span>
              </div>
              <Link
                href="#about"
                className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-white/50 bg-black/40 text-white transition-colors duration-300 hover:bg-[#FFDD00] hover:text-black touch-manipulation focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
                aria-label="Scroll to about section"
              >
                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-black/30 transition-colors" />
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-transform duration-300 group-hover:translate-y-1"
                >
                  <circle cx="11" cy="11" r="9" stroke="currentColor" strokeOpacity="0.45" />
                  <path
                    d="M7.5 10.5L11 14L14.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 7.5V13"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

