'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/lib/imageUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import SkeletonLoader from '@/components/SkeletonLoader';

interface Project {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  galleryImages?: string[];
  tags: string[];
  tagsAr: string[];
  category: string;
  categoryAr: string;
  year: string;
  link?: string;
  featured: boolean;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params?.id) {
      fetchProject(params.id as string);
    }
  }, [params?.id]);

  const fetchProject = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/projects/${id}`);
      
      if (!res.ok) {
        if (res.status === 404) {
          setError('Project not found');
        } else {
          setError('Failed to load project');
        }
        return;
      }
      
      const data = await res.json();
      setProject(data);
    } catch (err) {
      console.error('Failed to fetch project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="pt-20">
          <SkeletonLoader variant="project" count={1} />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 md:px-10 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#FFDD00]">
              {error || 'Project Not Found'}
            </h1>
            <p className="text-white/70 mb-8 text-lg">
              {error || 'The project you are looking for does not exist.'}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center px-8 py-4 bg-[#FFDD00] text-black rounded-lg font-semibold transition-all duration-300 hover:bg-[#FFDD00]/90"
              >
                <span>{language === 'ar' ? 'العودة إلى المشاريع' : 'Back to Projects'}</span>
                <motion.svg
                  className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  whileHover={{ x: language === 'ar' ? 4 : -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-20 sm:pt-24 md:pt-28 pb-4 md:pb-6 safe-area-left safe-area-right"
        aria-label="Breadcrumb"
      >
        <ol className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'} text-sm text-white/70`}>
          <li>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" className="hover:text-[#FFDD00] transition-colors duration-300 ease-out">
                {language === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
            </motion.div>
          </li>
          <li aria-hidden="true">
            <span className="mx-2">/</span>
          </li>
          <li>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/projects" className="hover:text-[#FFDD00] transition-colors duration-300 ease-out">
                {language === 'ar' ? 'المشاريع' : 'Projects'}
              </Link>
            </motion.div>
          </li>
          <li aria-hidden="true">
            <span className="mx-2">/</span>
          </li>
          <li className="text-white font-medium" aria-current="page">
            {language === 'ar' ? project.titleAr : project.title}
          </li>
        </ol>
      </motion.nav>

      {/* Hero Banner with Project Image */}
      <section className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src={getImageUrl(project.image)}
            alt={language === 'ar' ? project.titleAr : project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 sm:px-6 md:px-10 pb-12 md:pb-16 lg:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-4xl"
              >
                {/* Year Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  className="inline-block mb-4"
                >
                  <span className="bg-[#FFDD00] text-black px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                    {project.year}
                  </span>
                </motion.div>
                
                {/* Category */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4"
                >
                  <span className="text-sm md:text-base font-semibold text-[#FFDD00] uppercase tracking-wider">
                    {language === 'ar' ? project.categoryAr : project.category}
                  </span>
                </motion.div>
                
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                >
                  {language === 'ar' ? project.titleAr : project.title}
                </motion.h1>
                
                {/* Tags */}
                {project.tags.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-wrap gap-2 mt-6"
                  >
                    {(language === 'ar' ? project.tagsAr : project.tags).map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: 'spring', stiffness: 200 }}
                        whileHover={{ 
                          scale: 1.1,
                          backgroundColor: 'rgba(255, 221, 0, 0.2)',
                          borderColor: 'rgba(255, 221, 0, 0.5)',
                          color: '#FFDD00'
                        }}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full uppercase tracking-wider border border-white/20 transition-all duration-200 cursor-default"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Project Details Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 safe-area-left safe-area-right">
        <div className="container mx-auto max-w-[min(56rem,95vw)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="bg-[#111114] rounded-2xl p-8 md:p-10 lg:p-12 border border-white/10"
          >
            {/* Description */}
            <div className="mb-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl font-bold mb-6 text-[#FFDD00]"
              >
                {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-line"
              >
                {language === 'ar' ? project.descriptionAr : project.description}
              </motion.p>
            </div>

            {/* Project Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-white/5"
              >
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                  {language === 'ar' ? 'السنة' : 'Year'}
                </h3>
                <p className="text-2xl font-bold text-white">{project.year}</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-white/5"
              >
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                  {language === 'ar' ? 'الفئة' : 'Category'}
                </h3>
                <p className="text-2xl font-bold text-white">
                  {language === 'ar' ? project.categoryAr : project.category}
                </p>
              </motion.div>
            </div>

            {/* Gallery Images */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-2xl md:text-3xl font-bold mb-6 text-[#FFDD00]"
                >
                  {language === 'ar' ? 'معرض الصور' : 'Project Gallery'}
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.galleryImages.map((imageId, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group cursor-pointer"
                    >
                      <Image
                        src={getImageUrl(imageId)}
                        alt={`${language === 'ar' ? project.titleAr : project.title} - Gallery ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* External Link Button */}
            {project.link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="pt-6 border-t border-white/10"
              >
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: '#e6c700',
                    boxShadow: '0 8px 16px rgba(255, 221, 0, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center px-8 py-4 bg-[#FFDD00] text-black rounded-lg font-semibold transition-all duration-300"
                >
                  <span>{language === 'ar' ? 'عرض المشروع' : 'View Project'}</span>
                  <motion.svg
                    className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    whileHover={{ x: language === 'ar' ? -4 : 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </motion.svg>
                </motion.a>
              </motion.div>
            )}

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 pt-6 border-t border-white/10"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 ease-out"
                >
                  <motion.svg
                    className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    whileHover={{ x: language === 'ar' ? 4 : -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                  </motion.svg>
                  <span>{language === 'ar' ? 'العودة إلى المشاريع' : 'Back to Projects'}</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

