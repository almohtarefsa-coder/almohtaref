'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { getImageUrl } from '@/lib/imageUtils';

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
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

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
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right relative overflow-hidden">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900/50 animate-pulse" style={{ aspectRatio: '16/9' }} />
        </div>
      </section>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  // Get featured video (first one or highest order)
  const featuredVideo = videos.sort((a, b) => a.order - b.order)[0];
  const otherVideos = videos.filter(v => v._id !== featuredVideo._id).slice(0, 2);

  return (
    <>
      <section id="videos" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 lg:px-10 bg-black text-white safe-area-left safe-area-right relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FFDD00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FFE640]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-[min(1400px,95vw)] mx-auto relative z-10">
          {/* Featured Video - Hero Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 sm:mb-16 md:mb-20"
          >
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredVideo(featuredVideo._id)}
              onMouseLeave={() => setHoveredVideo(null)}
              onClick={() => setSelectedVideo(featuredVideo)}
            >
              {/* Video Container with Premium Frame */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 p-2 sm:p-3 md:p-4 shadow-2xl">
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 221, 0, 0.15) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                  animate={{
                    opacity: hoveredVideo === featuredVideo._id ? 0.3 : 0,
                  }}
                />

                {/* Video Thumbnail */}
                <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {featuredVideo.thumbnail ? (
                    <motion.img
                      src={getImageUrl(featuredVideo.thumbnail)}
                      alt={language === 'ar' && featuredVideo.titleAr ? featuredVideo.titleAr : featuredVideo.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredVideo === featuredVideo._id ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                      <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button - Premium Design */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="relative"
                      animate={{
                        scale: hoveredVideo === featuredVideo._id ? 1.1 : 1,
                        rotate: hoveredVideo === featuredVideo._id ? [0, -2, 2, -2, 0] : 0,
                      }}
                      transition={{
                        scale: { duration: 0.3 },
                        rotate: { duration: 0.6, ease: 'easeInOut' },
                      }}
                    >
                      {/* Outer Glow Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{
                          scale: hoveredVideo === featuredVideo._id ? [1, 1.3, 1] : 1,
                          opacity: hoveredVideo === featuredVideo._id ? [0.5, 0.8, 0.5] : 0.5,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        style={{
                          background: 'radial-gradient(circle, rgba(255, 221, 0, 0.4) 0%, transparent 70%)',
                          filter: 'blur(15px)',
                        }}
                      />

                      {/* Play Button */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-[#FFDD00] to-[#FFE640] rounded-full flex items-center justify-center shadow-2xl shadow-[#FFDD00]/50 group-hover:shadow-[#FFDD00]/80 transition-all duration-300">
                        <motion.svg
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-black ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          animate={{
                            x: hoveredVideo === featuredVideo._id ? 2 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </motion.svg>
                      </div>
                    </motion.div>
                  </div>

                  {/* Video Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 text-white drop-shadow-lg">
                        {language === 'ar' && featuredVideo.titleAr ? featuredVideo.titleAr : featuredVideo.title}
                      </h3>
                      {(featuredVideo.description || featuredVideo.descriptionAr) && (
                        <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-2xl line-clamp-2 drop-shadow-md">
                          {language === 'ar' && featuredVideo.descriptionAr ? featuredVideo.descriptionAr : featuredVideo.description}
                        </p>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Other Videos Grid */}
          {otherVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8"
            >
              {otherVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="relative group cursor-pointer"
                  onMouseEnter={() => setHoveredVideo(video._id)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Video Card */}
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900/30 to-black/50 p-1.5 sm:p-2 shadow-xl">
                    {/* Hover Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0"
                      animate={{
                        opacity: hoveredVideo === video._id ? 0.2 : 0,
                      }}
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255, 221, 0, 0.3) 0%, transparent 70%)',
                        filter: 'blur(15px)',
                      }}
                    />

                    {/* Thumbnail */}
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
                      {video.thumbnail ? (
                        <motion.img
                          src={getImageUrl(video.thumbnail)}
                          alt={language === 'ar' && video.titleAr ? video.titleAr : video.title}
                          className="w-full h-full object-cover"
                          animate={{
                            scale: hoveredVideo === video._id ? 1.08 : 1,
                          }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: hoveredVideo === video._id ? 1.15 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:bg-white transition-all duration-300">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-black ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        </motion.div>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <h4 className="text-white font-semibold text-base sm:text-lg line-clamp-2 drop-shadow-lg">
                          {language === 'ar' && video.titleAr ? video.titleAr : video.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Premium Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999]"
              onClick={() => setSelectedVideo(null)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-w-6xl bg-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Video Player */}
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <video
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    src={getVideoUrl(selectedVideo.video)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video Info */}
                <div className="p-6 sm:p-8 md:p-10 border-t border-white/10">
                  <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                    {language === 'ar' && selectedVideo.titleAr ? selectedVideo.titleAr : selectedVideo.title}
                  </h3>
                  {(selectedVideo.description || selectedVideo.descriptionAr) && (
                    <p className="text-white/70 text-base sm:text-lg md:text-xl leading-relaxed">
                      {language === 'ar' && selectedVideo.descriptionAr ? selectedVideo.descriptionAr : selectedVideo.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
