'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import RotatingButton from './RotatingButton';
import { useLanguage } from '@/contexts/LanguageContext';

// Icon Components
function PhoneIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function BanknoteIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
      <path d="M6 10H6.01M18 10H18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ChairIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12C5 10.8954 5.89543 10 7 10H17C18.1046 10 19 10.8954 19 12V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 10V6C9 4.89543 9.89543 4 11 4H13C14.1046 4 15 4.89543 15 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 19H3M19 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 10H16.74C16.3659 8.551 15.2143 7.24999 13.7041 6.49548C12.1939 5.74097 10.4465 5.59219 8.81472 6.08517C7.18298 6.57815 5.79138 7.6771 4.93147 9.15272C4.07157 10.6283 3.79971 12.3691 4.16852 13.9971C4.53733 15.6251 5.52142 17.0194 6.91447 17.9013C8.30752 18.7832 10.0117 19.0889 11.6463 18.7527C13.2809 18.4165 14.7294 17.4594 15.6801 16.08M18 10C18.5304 10 19.0391 10.2107 19.4142 10.5858C19.7893 10.9609 20 11.4696 20 12C20 12.5304 19.7893 13.0391 19.4142 13.4142C19.0391 13.7893 18.5304 14 18 14H6C5.46957 14 4.96086 13.7893 4.58579 13.4142C4.21071 13.0391 4 12.5304 4 12C4 11.4696 4.21071 10.9609 4.58579 10.5858C4.96086 10.2107 5.46957 10 6 10M18 10C18.3145 10 18.6215 9.94404 18.9097 9.83706C19.1979 9.73008 19.4623 9.57403 19.6906 9.37659C19.9189 9.17915 20.1072 8.94377 20.2462 8.68203C20.3852 8.42029 20.4723 8.13698 20.5029 7.84568C20.5335 7.55438 20.5071 7.2603 20.4252 6.97871C20.3433 6.69712 20.2075 6.43288 20.0251 6.20026C19.8427 5.96764 19.6173 5.77099 19.361 5.62091C19.1047 5.47082 18.8224 5.37008 18.5291 5.32431C18.2358 5.27854 17.9371 5.28858 17.6478 5.35389C17.3585 5.4192 17.0841 5.53841 16.8399 5.70528C16.5957 5.87215 16.3862 6.08338 16.2231 6.32743" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function getIcon(iconName: string) {
  switch (iconName) {
    case 'phone':
      return <PhoneIcon />;
    case 'banknote':
      return <BanknoteIcon />;
    case 'chair':
      return <ChairIcon />;
    case 'cloud':
      return <CloudIcon />;
    default:
      return null;
  }
}

export default function Services() {
  const { t } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const services = [
    {
      title: t('services.step1.title'),
      icon: 'phone',
      description: t('services.step1.description'),
    },
    {
      title: t('services.step2.title'),
      icon: 'banknote',
      description: t('services.step2.description'),
    },
    {
      title: t('services.step3.title'),
      icon: 'chair',
      description: t('services.step3.description'),
    },
    {
      title: t('services.step4.title'),
      icon: 'cloud',
      description: t('services.step4.description'),
    },
  ];

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
      <div className="max-w-[min(1400px,95vw)] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {/* Horizontal line above */}
          <div style={{ width: '40px', height: '1px', backgroundColor: 'white', marginBottom: '12px' }} />
          {/* SERVICES text */}
          <h4 className="text-sm md:text-base font-semibold text-white uppercase tracking-wider mb-8">
            {t('services.title')}
          </h4>
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[clamp(1.875rem,6vw,4.375rem)] font-bold mb-8 sm:mb-10 md:mb-12 lg:mb-16 text-center text-overflow-safe"
        >
          {t('services.heading')}
        </motion.h2>

        {/* Service Cards */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          {services.map((service, index) => {
            const isActive = selectedIndex === index;
            const isHovered = hoveredIndex === index;
            const isNormal = !isActive && !isHovered;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setSelectedIndex(index)}
                className="flex flex-col items-center cursor-pointer touch-manipulation"
                style={{
                  padding: 'clamp(1rem, 4vw, 2rem)',
                  borderRadius: isActive ? '50%' : 'clamp(28px, 6vw, 45px)',
                  border: isActive 
                    ? '2px solid #FFDD00' 
                    : isHovered 
                    ? '2px solid #FFDD00' 
                    : '1px solid rgba(255, 255, 255, 0.4)',
                  width: isActive ? 'clamp(160px, min(25vw, 300px), 300px)' : 'clamp(140px, min(23vw, 280px), 280px)',
                  height: isActive ? 'clamp(160px, min(25vw, 300px), 300px)' : 'auto',
                  minHeight: isActive ? 'clamp(160px, min(25vw, 300px), 300px)' : 'clamp(140px, min(23vw, 280px), 280px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  flexShrink: 0,
                  backgroundColor: isActive ? 'rgba(255, 221, 0, 0.1)' : isHovered ? 'rgba(255, 221, 0, 0.05)' : '#111114',
                  maxWidth: '100%',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Golden glow effect for active card */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255, 221, 0, 0.3), rgba(255, 221, 0, 0.15), rgba(255, 221, 0, 0.05))',
                      filter: 'blur(20px)',
                      zIndex: 0,
                    }}
                  />
                )}
                
                {/* Golden glow effect for hovered card */}
                {isHovered && !isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: isActive ? '50%' : 'clamp(28px, 6vw, 45px)',
                      background: 'radial-gradient(circle, rgba(255, 221, 0, 0.15), rgba(255, 221, 0, 0.05), transparent)',
                      filter: 'blur(15px)',
                      zIndex: 0,
                    }}
                  />
                )}
                
                {/* Icon */}
                <div 
                  className="mb-4"
                  style={{ 
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive || isHovered ? '#FFDD00' : 'white',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {getIcon(service.icon)}
                </div>
                
                {/* Title */}
                <h4 
                  className="text-base md:text-lg font-semibold text-center"
                  style={{ 
                    position: 'relative',
                    zIndex: 1,
                    color: isActive || isHovered ? '#FFDD00' : 'white',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {service.title}
                </h4>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <motion.p
            key={selectedIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm sm:text-base md:text-lg text-white text-center text-overflow-safe"
            style={{ 
              maxWidth: 'min(100%, 90vw)',
              padding: 'clamp(0.75rem, 3vw, 1.5rem)',
              borderRadius: 'clamp(12px, 2vw, 16px)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
            }}
          >
            {services[selectedIndex].description}
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          {/* SEND WHATS UP Button */}
          <a
            href="https://wa.me/966536137573"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RotatingButton
              text={t('services.sendWhatsApp')}
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
              text={t('services.callUs')}
              width="auto"
              height={48}
              borderRadius={24}
              fontSize={16}
              fontWeight={600}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

