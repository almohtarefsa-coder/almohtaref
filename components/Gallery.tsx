'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import RotatingButton from './RotatingButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monoton } from 'next/font/google';
import { getImageUrl } from '@/lib/imageUtils';

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface GalleryImage {
  _id: string;
  image: string;
  alt: string;
  altAr?: string;
  order: number;
}

export default function Gallery() {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('cutting');
  const [windowWidth, setWindowWidth] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setGalleryImages(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleryImages();
  }, []);

  const filters = [
    { key: 'cutting', label: t('gallery.filters.cutting') },
    { key: 'perforation', label: t('gallery.filters.perforation') },
  ];

  return (
    <section id="project" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
      <div className="max-w-[min(1400px,95vw)] mx-auto">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-[clamp(1.875rem,6vw,4.375rem)] mb-6 sm:mb-8 md:mb-10 lg:mb-12 ${monoton.className} text-overflow-safe`}
          style={{ textAlign: 'left' }}
        >
          {t('gallery.heading')}
        </motion.h2>

        {/* Image Gallery - Responsive masonry layout */}
        {loading ? (
          <div className="mb-8 sm:mb-10 md:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden border border-white/20 bg-gray-900 animate-pulse"
                style={{
                  aspectRatio: i === 0 || i === 1 ? '6/5' : i === 4 ? '1/1' : '3/4',
                  marginTop: (i === 1 || i === 3 || i === 5) && windowWidth >= 640 ? '2rem' : '0',
                }}
              />
            ))}
          </div>
        ) : galleryImages.length > 0 ? (
          <div className="mb-8 sm:mb-10 md:mb-12 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {galleryImages.slice(0, 6).map((img, index) => {
              // Define aspect ratios based on position (maintaining original layout)
              const aspectRatios: { [key: number]: string } = {
                0: '6/5',
                1: '6/5',
                2: '3/4',
                3: '3/4',
                4: '1/1',
                5: '3/4',
              };
              const aspectRatio = aspectRatios[index] || '6/5';
              const marginTop = [1, 3, 5].includes(index) && windowWidth >= 640 ? 'sm:mt-8 md:mt-12' : '';
              
              return (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-lg overflow-hidden border border-white ${marginTop}`}
                  style={{ aspectRatio }}
                >
                  <Image
                    src={getImageUrl(img.image)}
                    alt={language === 'ar' && img.altAr ? img.altAr : img.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="mb-8 sm:mb-10 md:mb-12 text-center text-white/50 py-12">
            {t('gallery.noImages') || 'No images available'}
          </div>
        )}

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"
          role="group"
          aria-label="Gallery filters"
        >
          {filters.map((filter) => (
            <RotatingButton
              key={filter.key}
              text={filter.label}
              width={windowWidth > 0 ? Math.min(240, windowWidth * 0.8) : 240}
              height={48}
              borderRadius={24}
              fontSize={16}
              fontWeight={600}
              letterSpacing={0}
              isActive={activeFilter === filter.key}
              useGradient={true}
              className="pointer-events-none cursor-default"
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

