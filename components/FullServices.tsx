'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import RotatingButton from '@/components/RotatingButton';
import { useLanguage } from '@/contexts/LanguageContext';

const serviceImages = [
  '/drilling-service.webp',
  '/cutting-reinforced-service.webp',
  '/almohtaref/IMG-20251114-WA0017.jpg',
  '/repairingCracks.webp',
  '/DeliberateService.webp',
];

export default function FullServices() {
  const { t } = useLanguage();
  
  const serviceList = (t('fullServices.services') as Array<{
    description: string;
    alt: string;
  }>).map((service, index) => ({
    ...service,
    image: serviceImages[index],
  }));
  
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
      <div className="max-w-[min(1000px,95vw)] mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Horizontal line and "Our services" text */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-white/60"></div>
            <h4 className="text-sm md:text-base font-semibold text-white/85 uppercase tracking-wider">
              {t('fullServices.ourServices')}
            </h4>
          </div>

          {/* Main heading with button */}
          <div className="flex flex-col items-start gap-6">
            <h2 className="text-[clamp(1.875rem,6vw,3.75rem)] font-bold text-white text-overflow-safe">
              {t('fullServices.discoverFullServices')}
            </h2>
            <div className="w-full flex justify-center">
              <button className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap w-fit text-white bg-gradient-to-r from-[#8b7500] via-[#b89a00] to-[#FFDD00] hover:from-[#a08500] hover:via-[#c9a500] hover:to-[#FFE640] shadow-lg">
                {t('fullServices.concreteCuttingAndDrilling')}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Service List */}
        <div className="space-y-12 mb-8">
          {serviceList.map((service, index) => {
            const isImageLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#111114] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white"
              >
                <div className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                  {/* Image Placeholder */}
                  <div className="relative flex-shrink-0 w-full md:w-2/5 h-48 sm:h-64 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover"
                      priority={index < 2}
                    />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1">
                    <p className="text-white">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: serviceList.length * 0.1 }}
          className="bg-[#111114] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative flex-shrink-0 w-full md:w-2/5 h-48 sm:h-64 md:h-80 rounded-2xl sm:rounded-3xl overflow-hidden">
              <Image
                src="/api/images/6914adeeeb8f390879f6fc2c"
                alt={t('fullServices.wireCuttingCardAlt')}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-white">{t('fullServices.wireCuttingCardText')}</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center border border-white bg-gradient-to-r from-[#2f2408] via-[#FFDD00] to-[#6f5208]"
        >
          <p className="text-white text-base sm:text-lg mb-4 sm:mb-6">
            {t('fullServices.learnAboutServices')}
          </p>
          <RotatingButton text={t('services.callUs')} />
        </motion.div>
      </div>
    </section>
  );
}

