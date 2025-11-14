'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Monoton } from 'next/font/google';
import { getImageUrl } from '@/lib/imageUtils';

const monoton = Monoton({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface Video {
  _id: string;
  video: string;
  title: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  thumbnail?: string;
  order: number;
}

export default function Videos() {
  const { t, language } = useLanguage();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch('/api/videos');
        if (res.ok) {
          const data = await res.json();
          setVideos(data);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const getVideoUrl = (videoId: string): string => {
    if (videoId.startsWith('http') || videoId.startsWith('/')) {
      return videoId;
    }
    return `/api/videos/stream/${videoId}`;
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden border border-white/20 bg-gray-900 animate-pulse"
                style={{ aspectRatio: '16/9' }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <>
      <section id="videos" className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right">
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
            {t('videos.heading') || 'Videos'}
          </motion.h2>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {videos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative rounded-lg overflow-hidden border border-white/20 group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
                style={{ aspectRatio: '16/9' }}
              >
                {video.thumbnail ? (
                  <img
                    src={getImageUrl(video.thumbnail)}
                    alt={language === 'ar' && video.titleAr ? video.titleAr : video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                )}
                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </motion.div>
                </div>
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
                    {language === 'ar' && video.titleAr ? video.titleAr : video.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition-colors"
            >
              ×
            </button>
            <video
              controls
              autoPlay
              className="w-full"
              style={{ maxHeight: '80vh' }}
            >
              <source src={getVideoUrl(selectedVideo.video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="p-4 sm:p-6">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                {language === 'ar' && selectedVideo.titleAr ? selectedVideo.titleAr : selectedVideo.title}
              </h3>
              {(selectedVideo.description || selectedVideo.descriptionAr) && (
                <p className="text-white/70 text-sm sm:text-base">
                  {language === 'ar' && selectedVideo.descriptionAr ? selectedVideo.descriptionAr : selectedVideo.description}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

