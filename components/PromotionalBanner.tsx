'use client';

import { motion } from 'framer-motion';
import RotatingButton from './RotatingButton';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PromotionalBanner() {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-[clamp(20px,4vw,48px)] p-6 sm:p-8 md:p-10 lg:p-12 text-left"
      style={{
        background: 'linear-gradient(to right, #505050, #6b5a00, #8b7500, #b89a00, #d4b800, #FFDD00)',
      }}
    >
      {/* Main Heading */}
      <h2 className="text-[clamp(1.5rem,5vw,3rem)] font-bold mb-3 sm:mb-4 text-white text-overflow-safe">
        {t('promotional.heading')}
      </h2>
      
      {/* Body Text */}
      <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed text-overflow-safe" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
        {t('promotional.description')}
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* SEND WHATS UP Button */}
        <a
          href="https://wa.me/966536137573"
          target="_blank"
          rel="noopener noreferrer"
        >
            <RotatingButton
              text={t('promotional.sendWhatsApp')}
              width="auto"
              height={48}
              borderRadius={24}
              fontSize={16}
              fontWeight={600}
            />
          </a>

          {/* CALL US Button */}
          <a href="#contact">
            <RotatingButton
              text={t('promotional.callUs')}
              width="auto"
              height={48}
              borderRadius={24}
              fontSize={16}
              fontWeight={600}
            />
        </a>
      </div>
    </motion.div>
  );
}

