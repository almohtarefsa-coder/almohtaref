'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Project {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  image: string;
  tags: string[];
  tagsAr: string[];
  category: string;
  categoryAr: string;
  year: string;
  link?: string;
  featured: boolean;
}

interface Service {
  _id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  features: string[];
  featuresAr: string[];
  featured: boolean;
}

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  location?: string;
  rating: number;
  text: string;
  textAr?: string;
  approved: boolean;
}

interface Banner {
  _id: string;
  page: 'home' | 'contact' | 'about';
  image: string;
}

interface GalleryImage {
  _id: string;
  image: string;
  alt: string;
  altAr?: string;
  order: number;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Toast Notification Component
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  const colors = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-lg shadow-lg ${colors[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// Toast Container
function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[10000] flex flex-col gap-2 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'projects' | 'services' | 'testimonials' | 'banners' | 'gallery'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (!auth) {
      router.push('/admin/login');
      return;
    }
    fetchAllData();
  }, [router]);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      // On desktop, always show sidebar
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const fetchAllData = async () => {
    try {
      const [projectsRes, servicesRes, testimonialsRes, bannersRes, galleryRes] = await Promise.all([
        fetch('/api/projects', { headers: adminHeaders }),
        fetch('/api/services', { headers: adminHeaders }),
        fetch('/api/testimonials', { headers: adminHeaders }),
        fetch('/api/banners', { headers: adminHeaders }),
        fetch('/api/gallery', { headers: adminHeaders }),
      ]);
      setProjects(await projectsRes.json());
      setServices(await servicesRes.json());
      setTestimonials(await testimonialsRes.json());
      setBanners(await bannersRes.json());
      setGalleryImages(await galleryRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  const handleDelete = async (type: string, id: string) => {
    if (!confirm(t('admin.deleteConfirm'))) return;

    try {
      const res = await fetch(`/api/${type}/${id}`, { 
        method: 'DELETE',
        headers: adminHeaders,
      });
      if (res.ok) {
        showToast(`${type.slice(0, -1)} deleted successfully`, 'success');
        fetchAllData();
      } else {
        showToast('Failed to delete item', 'error');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('Failed to delete item', 'error');
    }
  };

  const handleToggleFeatured = async (type: string, id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ featured: !currentValue }),
      });
      if (res.ok) {
        showToast(`Item ${!currentValue ? 'featured' : 'unfeatured'} successfully`, 'success');
        fetchAllData();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      showToast('Failed to update item', 'error');
    }
  };

  const handleToggleApproved = async (id: string, currentValue: boolean) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ approved: !currentValue }),
      });
      if (res.ok) {
        showToast(`Testimonial ${!currentValue ? 'approved' : 'unapproved'}`, 'success');
        fetchAllData();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      showToast('Failed to update testimonial', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const url = editingItem
        ? `/api/${activeTab}/${editingItem}`
        : `/api/${activeTab}`;
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast(`${editingItem ? 'Updated' : 'Created'} successfully`, 'success');
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
        fetchAllData();
      } else {
        showToast('Failed to save', 'error');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('Failed to save', 'error');
    }
  };

  const openNewForm = useCallback(() => {
    setEditingItem(null);
    const initialData: any = {};
    if (activeTab === 'projects') {
      initialData.title = '';
      initialData.titleAr = '';
      initialData.description = '';
      initialData.descriptionAr = '';
      initialData.image = '';
      initialData.category = '';
      initialData.categoryAr = '';
      initialData.year = '';
      initialData.link = '';
    } else if (activeTab === 'services') {
      initialData.title = '';
      initialData.titleAr = '';
      initialData.description = '';
      initialData.descriptionAr = '';
      initialData.icon = '';
    } else if (activeTab === 'testimonials') {
      initialData.name = '';
      initialData.company = '';
      initialData.location = '';
      initialData.rating = 5;
      initialData.text = '';
      initialData.textAr = '';
      initialData.approved = false;
    }
    setFormData(initialData);
    setShowForm(true);
  }, [activeTab]);

  const openEditForm = (item: any) => {
    setEditingItem(item._id);
    setFormData({ ...item });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
          />
          <div className="text-xl">{t('admin.loading')}</div>
        </motion.div>
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Mobile Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#111114] border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-lg"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex flex-col gap-1.5 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={{ rotate: isSidebarOpen ? 45 : 0, y: isSidebarOpen ? 8 : 0 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
          <motion.span
            animate={{ opacity: isSidebarOpen ? 0 : 1 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
          <motion.span
            animate={{ rotate: isSidebarOpen ? -45 : 0, y: isSidebarOpen ? -8 : 0 }}
            className="w-6 h-0.5 bg-white transition-all duration-300"
          />
        </motion.button>
        <h1 className="text-xl font-bold text-[#FFDD00]">{t('admin.panel')}</h1>
        <div className="w-10" />
      </motion.div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isDesktop || isSidebarOpen ? 0 : '-100%',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-full w-64 bg-[#111114] border-r border-white/10 p-6 z-50 shadow-2xl`}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-xl md:text-2xl font-bold text-[#FFDD00]">{t('admin.panel')}</h1>
        </motion.div>
        <nav className="space-y-2">
          {[
            { id: 'projects', label: t('admin.tabs.projects') },
            { id: 'services', label: t('admin.tabs.services') },
            { id: 'testimonials', label: t('admin.tabs.testimonials') },
            { id: 'banners', label: t('admin.tabs.banners') },
            { id: 'gallery', label: t('admin.tabs.gallery') },
          ].map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(tab.id as any);
                setShowForm(false);
                setEditingItem(null);
                setIsSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-semibold shadow-lg shadow-[#FFDD00]/30'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-black/20 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </nav>
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <span>{t('admin.logout')}</span>
        </motion.button>
      </motion.aside>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold capitalize bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {t(`admin.tabs.${activeTab}`)}
            </h2>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 overflow-x-auto shadow-xl"
          >
            {activeTab === 'projects' && (
              <ProjectsSection
                projects={projects}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('projects', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'services' && (
              <ServicesSection
                services={services}
                onEdit={openEditForm}
                onDelete={(id) => handleDelete('services', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'testimonials' && (
              <TestimonialsSection
                testimonials={testimonials}
                onEdit={openEditForm}
                onToggleApproved={(id, current) => handleToggleApproved(id, current)}
                onDelete={(id) => handleDelete('testimonials', id)}
                onAddNew={openNewForm}
              />
            )}

            {activeTab === 'banners' && (
              <BannersSection banners={banners} onUpdate={fetchAllData} showToast={showToast} />
            )}

            {activeTab === 'gallery' && (
              <GallerySection galleryImages={galleryImages} onUpdate={fetchAllData} showToast={showToast} />
            )}
          </motion.div>
        </div>
      </main>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <FormModal
            key={editingItem || 'new'}
            type={activeTab}
            data={formData}
            onChange={setFormData}
            onSave={handleSave}
            onClose={() => {
              setShowForm(false);
              setEditingItem(null);
              setFormData({});
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Enhanced Button Component with Ripple Effect
function RippleButton({
  children,
  onClick,
  className,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y }}
          animate={{ width: 300, height: 300, x: ripple.x - 150, y: ripple.y - 150, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
    </motion.button>
  );
}

// Projects Section Component
function ProjectsSection({
  projects,
  onEdit,
  onDelete,
  onAddNew,
}: {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors">
                  {project.title}
                </h3>
              </div>
              <p className="text-white/70 text-sm line-clamp-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-white/50">{project.category}</span>
                <span className="text-xs text-white/50">•</span>
                <span className="text-xs text-white/50">{project.year}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(project)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.edit')}
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(project._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.delete')}
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: projects.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          {t('admin.addNew')}
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Services Section Component
function ServicesSection({
  services,
  onEdit,
  onDelete,
  onAddNew,
}: {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {services.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors">
                  {service.title}
                </h3>
              </div>
              <p className="text-white/70 text-sm line-clamp-1">{service.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => onEdit(service)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.edit')}
              </RippleButton>
              <RippleButton
                onClick={() => onDelete(service._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.delete')}
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: services.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          {t('admin.addNew')}
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Testimonials Section Component
function TestimonialsSection({
  testimonials,
  onEdit,
  onToggleApproved,
  onDelete,
  onAddNew,
}: {
  testimonials: Testimonial[];
  onEdit: (testimonial: Testimonial) => void;
  onToggleApproved: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-2 gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-[#FFDD00] transition-colors">
                  {testimonial.name}
                </h3>
                <p className="text-white/70 text-sm">{testimonial.company}</p>
                {testimonial.location && (
                  <p className="text-white/50 text-xs">{testimonial.location}</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                <RippleButton
                  onClick={() => onEdit(testimonial)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
                >
                  {t('admin.edit')}
                </RippleButton>
                <RippleButton
                  onClick={() => onToggleApproved(testimonial._id, testimonial.approved)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg min-w-[90px] ${
                    testimonial.approved
                      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white'
                      : 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white'
                  }`}
                >
                  {testimonial.approved ? t('admin.approved') : t('admin.approve')}
                </RippleButton>
                <RippleButton
                  onClick={() => onDelete(testimonial._id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
                >
                  {t('admin.delete')}
                </RippleButton>
              </div>
            </div>
            <p className="text-white/80 text-sm mt-2 break-words">{testimonial.text}</p>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[#FFDD00]"
                >
                  ★
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: testimonials.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={onAddNew}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          {t('admin.addNew')}
        </RippleButton>
      </motion.div>
    </div>
  );
}

// Banners Section Component
function BannersSection({
  banners,
  onUpdate,
  showToast,
}: {
  banners: Banner[];
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const { t } = useLanguage();
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState('');
  const [uploading, setUploading] = useState(false);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const handleSaveBanner = async (page: string) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ page, image: imageFileId }),
      });
      if (res.ok) {
        showToast('Banner updated successfully', 'success');
        setEditingBanner(null);
        setImageFileId('');
        onUpdate();
      } else {
        showToast('Failed to update banner', 'error');
      }
    } catch (error) {
      console.error('Failed to update banner:', error);
      showToast('Failed to update banner', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImageFileId(result.fileId);
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const bannerPages: Array<{ page: 'home' | 'contact' | 'about'; label: string }> = [
    { page: 'home', label: t('admin.form.bannerPages.home') },
    { page: 'contact', label: t('admin.form.bannerPages.contact') },
    { page: 'about', label: t('admin.form.bannerPages.about') },
  ];

  return (
    <div className="space-y-6">
      {bannerPages.map(({ page, label }, index) => {
        const banner = banners.find((b) => b.page === page);
        return (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            className="bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-6 border border-white/10 hover:border-[#FFDD00]/30 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <h3 className="font-semibold text-white mb-4">{label}</h3>
            {editingBanner === page ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">{t('admin.uploadImage')}</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
                    />
                  </motion.div>
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2 text-sm text-white/70"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
                      />
                      Uploading...
                    </motion.div>
                  )}
                </div>
                {(imageFileId || (banner && banner.image)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
                  >
                    <img
                      src={imageFileId ? `/api/images/${imageFileId}` : (banner?.image.startsWith('/') || banner?.image.startsWith('http') ? banner.image : `/api/images/${banner?.image}`)}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <div className="flex gap-2">
                  <RippleButton
                    onClick={() => handleSaveBanner(page)}
                    disabled={!imageFileId && !banner?.image}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('admin.save')}
                  </RippleButton>
                  <RippleButton
                    onClick={() => {
                      setEditingBanner(null);
                      setImageFileId('');
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {t('admin.cancel')}
                  </RippleButton>
                </div>
              </div>
            ) : (
              <div>
                {banner && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 mb-4 shadow-lg"
                  >
                    <img
                      src={banner.image.startsWith('/') || banner.image.startsWith('http') ? banner.image : `/api/images/${banner.image}`}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <RippleButton
                  onClick={() => {
                    setEditingBanner(page);
                    setImageFileId(banner?.image || '');
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {banner ? t('admin.changeImage') : t('admin.setImage')}
                </RippleButton>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Gallery Section Component
function GallerySection({
  galleryImages,
  onUpdate,
  showToast,
}: {
  galleryImages: GalleryImage[];
  onUpdate: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}) {
  const { t } = useLanguage();
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [imageFileId, setImageFileId] = useState('');
  const [altText, setAltText] = useState('');
  const [altTextAr, setAltTextAr] = useState('');
  const [order, setOrder] = useState(0);
  const [uploading, setUploading] = useState(false);

  const adminHeaders = {
    'X-Admin-Request': 'true',
  };

  const handleSaveGalleryImage = async (id?: string) => {
    try {
      const url = id ? `/api/gallery/${id}` : '/api/gallery';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...adminHeaders,
        },
        body: JSON.stringify({ 
          image: imageFileId, 
          alt: altText,
          altAr: altTextAr,
          order: order || 0,
        }),
      });
      if (res.ok) {
        showToast(id ? 'Gallery image updated successfully' : 'Gallery image added successfully', 'success');
        setEditingImage(null);
        setImageFileId('');
        setAltText('');
        setAltTextAr('');
        setOrder(0);
        onUpdate();
      } else {
        showToast('Failed to save gallery image', 'error');
      }
    } catch (error) {
      console.error('Failed to save gallery image:', error);
      showToast('Failed to save gallery image', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImageFileId(result.fileId);
        showToast('Image uploaded successfully', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery image?')) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      if (res.ok) {
        showToast('Gallery image deleted successfully', 'success');
        onUpdate();
      } else {
        showToast('Failed to delete gallery image', 'error');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      showToast('Failed to delete gallery image', 'error');
    }
  };

  const openEditForm = (image: GalleryImage) => {
    setEditingImage(image._id);
    setImageFileId(image.image);
    setAltText(image.alt);
    setAltTextAr(image.altAr || '');
    setOrder(image.order);
  };

  const openNewForm = () => {
    setEditingImage('new');
    setImageFileId('');
    setAltText('');
    setAltTextAr('');
    setOrder(galleryImages.length);
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-xl p-4 border border-white/10 hover:border-[#FFDD00]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/10"
          >
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden border border-white/20 flex-shrink-0 shadow-lg">
                <img
                  src={image.image.startsWith('/') || image.image.startsWith('http') ? image.image : `/api/images/${image.image}`}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate group-hover:text-[#FFDD00] transition-colors mb-1">
                  {image.alt}
                </p>
                {image.altAr && (
                  <p className="text-white/70 text-sm truncate mb-1">{image.altAr}</p>
                )}
                <p className="text-white/50 text-xs">Order: {image.order}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RippleButton
                onClick={() => openEditForm(image)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.edit')}
              </RippleButton>
              <RippleButton
                onClick={() => handleDelete(image._id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-medium hover:from-red-500 hover:to-red-400 transition-all duration-200 shadow-md hover:shadow-lg min-w-[70px]"
              >
                {t('admin.delete')}
              </RippleButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: galleryImages.length * 0.03 }}
        className="pt-4 border-t border-white/10"
      >
        <RippleButton
          onClick={openNewForm}
          className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#FFDD00]/30 transition-all duration-200"
        >
          {t('admin.addNew')} Gallery Image
        </RippleButton>
      </motion.div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditingImage(null);
                setImageFileId('');
                setAltText('');
                setAltTextAr('');
                setOrder(0);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFDD00] to-[#FFE640] bg-clip-text text-transparent flex-1">
                  {editingImage === 'new' ? 'Add Gallery Image' : 'Edit Gallery Image'}
                </h2>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setEditingImage(null);
                    setImageFileId('');
                    setAltText('');
                    setAltTextAr('');
                    setOrder(0);
                  }}
                  className="text-white/70 hover:text-white text-2xl flex-shrink-0 transition-colors"
                >
                  ×
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">{t('admin.uploadImage')}</label>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
                    />
                  </motion.div>
                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 flex items-center gap-2 text-sm text-white/70"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
                      />
                      Uploading...
                    </motion.div>
                  )}
                </div>
                {(imageFileId || (editingImage !== 'new' && galleryImages.find(img => img._id === editingImage))) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
                  >
                    <img
                      src={imageFileId ? `/api/images/${imageFileId}` : (galleryImages.find(img => img._id === editingImage)?.image.startsWith('/') || galleryImages.find(img => img._id === editingImage)?.image.startsWith('http') ? galleryImages.find(img => img._id === editingImage)?.image : `/api/images/${galleryImages.find(img => img._id === editingImage)?.image}`)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                <FormInput
                  label="Alt Text (English)"
                  value={altText}
                  onChange={(value) => setAltText(value)}
                  required
                />
                <FormInput
                  label="Alt Text (Arabic) - Optional"
                  value={altTextAr}
                  onChange={(value) => setAltTextAr(value)}
                />
                <FormInput
                  label="Order"
                  type="number"
                  value={order.toString()}
                  onChange={(value) => setOrder(parseInt(value) || 0)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <RippleButton
                  onClick={() => handleSaveGalleryImage(editingImage === 'new' ? undefined : editingImage)}
                  disabled={!imageFileId && editingImage === 'new'}
                  className="flex-1 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('admin.save')}
                </RippleButton>
                <RippleButton
                  onClick={() => {
                    setEditingImage(null);
                    setImageFileId('');
                    setAltText('');
                    setAltTextAr('');
                    setOrder(0);
                  }}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('admin.cancel')}
                </RippleButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Image Upload Component
function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (fileId: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      if (value.startsWith('/') || value.startsWith('http')) {
        setPreview(value);
      } else {
        setPreview(`/api/images/${value}`);
      }
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const adminHeaders = {
        'X-Admin-Request': 'true',
      };

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: adminHeaders,
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        onChange(result.fileId);
        setPreview(`/api/images/${result.fileId}`);
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-white/70 mb-2">{label}</label>
      <div className="space-y-2">
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full h-48 rounded-xl overflow-hidden border border-white/20 shadow-lg"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full bg-gray-800 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FFDD00] file:to-[#FFE640] file:text-black hover:file:from-[#FFE640] hover:file:to-[#FFDD00] transition-all duration-200 cursor-pointer disabled:opacity-50"
          />
        </motion.div>
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-sm text-white/70"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-[#FFDD00]/30 border-t-[#FFDD00] rounded-full"
            />
            Uploading...
          </motion.div>
        )}
        {value && !value.startsWith('/') && !value.startsWith('http') && (
          <p className="text-xs text-white/50">Image ID: {value}</p>
        )}
      </div>
    </div>
  );
}

// Enhanced Form Input Component
function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <motion.label
        initial={false}
        animate={{
          y: focused || value ? -8 : 0,
          fontSize: focused || value ? 12 : 14,
          color: focused ? '#FFDD00' : 'rgba(255, 255, 255, 0.7)',
        }}
        transition={{ duration: 0.2 }}
        className="absolute left-4 top-3 pointer-events-none origin-left"
      >
        {label}
      </motion.label>
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        whileFocus={{ scale: 1.01 }}
        className={`w-full bg-gray-800/50 border rounded-xl px-4 pt-6 pb-2 text-white placeholder-transparent focus:outline-none transition-all duration-200 ${
          focused
            ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
            : 'border-white/20 hover:border-white/30'
        }`}
        {...props}
      />
    </div>
  );
}

// Form Modal Component
function FormModal({
  type,
  data,
  onChange,
  onSave,
  onClose,
}: {
  type: string;
  data: any;
  onChange: (data: any) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const updateField = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111114] rounded-2xl border border-white/10 p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex justify-between items-start mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#FFDD00] to-[#FFE640] bg-clip-text text-transparent flex-1">
            {data._id ? t('admin.form.edit') : t('admin.form.addNew')} {t(`admin.tabs.${type.slice(0, -1)}`)}
          </h2>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl flex-shrink-0 transition-colors"
          >
            ×
          </motion.button>
        </div>

        <div className="space-y-4">
          {type === 'projects' && (
            <>
              <FormInput
                label={t('admin.form.title')}
                value={data.title || ''}
                onChange={(value) => updateField('title', value)}
              />
              <FormInput
                label={t('admin.form.titleAr')}
                value={data.titleAr || ''}
                onChange={(value) => updateField('titleAr', value)}
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('admin.form.description')}</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('admin.form.descriptionAr')}</label>
                <textarea
                  value={data.descriptionAr || ''}
                  onChange={(e) => updateField('descriptionAr', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                />
              </div>
              <ImageUploadField
                label={t('admin.form.image')}
                value={data.image || ''}
                onChange={(fileId) => updateField('image', fileId)}
              />
              <FormInput
                label={t('admin.form.category')}
                value={data.category || ''}
                onChange={(value) => updateField('category', value)}
              />
              <FormInput
                label={t('admin.form.categoryAr')}
                value={data.categoryAr || ''}
                onChange={(value) => updateField('categoryAr', value)}
              />
              <FormInput
                label={t('admin.form.year')}
                value={data.year || ''}
                onChange={(value) => updateField('year', value)}
              />
              <FormInput
                label={t('admin.form.link')}
                value={data.link || ''}
                onChange={(value) => updateField('link', value)}
              />
            </>
          )}

          {type === 'services' && (
            <>
              <FormInput
                label={t('admin.form.title')}
                value={data.title || ''}
                onChange={(value) => updateField('title', value)}
              />
              <FormInput
                label={t('admin.form.titleAr')}
                value={data.titleAr || ''}
                onChange={(value) => updateField('titleAr', value)}
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('admin.form.description')}</label>
                <textarea
                  value={data.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">{t('admin.form.descriptionAr')}</label>
                <textarea
                  value={data.descriptionAr || ''}
                  onChange={(e) => updateField('descriptionAr', e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                />
              </div>
              <FormInput
                label={t('admin.form.icon')}
                value={data.icon || ''}
                onChange={(value) => updateField('icon', value)}
              />
            </>
          )}

          {type === 'testimonials' && (
            <>
              <FormInput
                label="Name"
                value={data.name || ''}
                onChange={(value) => updateField('name', value)}
                required
              />
              <FormInput
                label="Company"
                value={data.company || ''}
                onChange={(value) => updateField('company', value)}
                required
              />
              <FormInput
                label="Location (optional)"
                value={data.location || ''}
                onChange={(value) => updateField('location', value)}
              />
              <div>
                <label className="block text-sm text-white/70 mb-2">Rating</label>
                <select
                  value={data.rating || 5}
                  onChange={(e) => updateField('rating', parseInt(e.target.value))}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  required
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Text (English)</label>
                <textarea
                  value={data.text || ''}
                  onChange={(e) => updateField('text', e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2">Text (Arabic) - Optional</label>
                <textarea
                  value={data.textAr || ''}
                  onChange={(e) => updateField('textAr', e.target.value)}
                  rows={4}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFDD00] focus:shadow-lg focus:shadow-[#FFDD00]/20 transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2">
                <motion.input
                  type="checkbox"
                  checked={data.approved || false}
                  onChange={(e) => updateField('approved', e.target.checked)}
                  whileTap={{ scale: 0.9 }}
                  className="w-5 h-5 rounded border-white/20 bg-gray-800 text-[#FFDD00] focus:ring-2 focus:ring-[#FFDD00] cursor-pointer"
                />
                <label className="text-sm text-white/70">Approved</label>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <RippleButton
            onClick={onSave}
            className="flex-1 bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black px-6 py-3 rounded-xl font-semibold hover:from-[#FFE640] hover:to-[#FFDD00] transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('admin.save')}
          </RippleButton>
          <RippleButton
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('admin.cancel')}
          </RippleButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
