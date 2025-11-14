'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SuccessStories() {
  const { t, language } = useLanguage();
  
  const stories = t('successStories.stories', { returnObjects: true }) as Array<{
    title: string;
    subtitle: string;
    challenge: string;
    solution: string;
    result: string;
  }>;
  
  const isRTL = language === 'ar';
  
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white relative overflow-hidden safe-area-left safe-area-right">
      <div className="max-w-[min(1600px,95vw)] mx-auto relative">
        {/* Title - Top Left */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.875rem,6vw,4.375rem)] font-bold text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16 text-overflow-safe"
          style={{ maxWidth: 'min(700px, 90vw)' }}
        >
          {t('successStories.heading')}
        </motion.h2>

        {/* Success Stories Cards - Right side, stacked vertically */}
        <div className="flex flex-col items-end">
          <div className="w-full max-w-[min(1000px,95vw)] space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
            {stories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative group overflow-hidden rounded-lg"
              >
                {/* Card with dark left and vertical gradient right */}
                <div className="relative flex flex-col sm:flex-row items-stretch min-h-[220px]">
                  {/* Left side - Dark/Black background */}
                  <div className="flex-1 bg-black p-4 sm:p-6 md:p-8">
                    <div className="h-full flex flex-col">
                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
                        {story.title}
                      </h3>
                      
                      {/* Subtitle */}
                      <p className="text-sm md:text-base text-white/85 mb-6">
                        {story.subtitle}
                      </p>
                      
                      {/* Content */}
                      <div className="space-y-3 flex-1">
                        <p className="text-white/90 text-sm md:text-base">
                          <span className="font-semibold text-white">{t('successStories.labels.challenge')}</span> {story.challenge}
                        </p>
                        <p className="text-white/90 text-sm md:text-base">
                          <span className="font-semibold text-white">{t('successStories.labels.solution')}</span> {story.solution}
                        </p>
                        <p className="text-white/90 text-sm md:text-base">
                          <span className="font-semibold text-white">{t('successStories.labels.result')}</span> {story.result}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Yellow background */}
                  <div 
                    className="relative p-4 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center min-w-full sm:min-w-[clamp(180px,25vw,240px)]"
                    style={{
                      backgroundColor: '#FFDD00'
                    }}
                  >
                    {/* KNOW MORE Button with blur glass container */}
                    <div 
                      className="px-4 py-3 rounded-lg"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <button className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity group/btn">
                        <span className="text-sm md:text-base font-semibold tracking-wide uppercase">{t('successStories.knowMore')}</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="group-hover/btn:translate-x-1 transition-transform"
                        >
                          <path
                            d="M7.5 15L12.5 10L7.5 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

