'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import PhoneNumber from './PhoneNumber';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
      });
      setIsSubmitting(false);
      alert(t('contact.form.success'));
    }, 1000);
  };

  const services = [
    t('servicesList.concreteCutting'),
    t('servicesList.reinforcedCutting'),
    t('servicesList.drilling'),
    t('servicesList.crackRepair'),
    t('servicesList.deliberateDemolition'),
    t('servicesList.consultation'),
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 overflow-hidden safe-area-left safe-area-right">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 max-w-[min(1400px,95vw)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="w-12 h-px bg-white/80 mb-4" />
            <h4 className="text-sm md:text-base font-semibold text-white/85 uppercase tracking-wider mb-8">
              {t('contact.getInTouch')}
            </h4>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[clamp(1.875rem,6vw,4.375rem)] font-bold mb-4 sm:mb-5 md:mb-6 text-overflow-safe"
          >
            {t('contact.heading')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-base sm:text-lg text-white/85 max-w-[min(48rem,90vw)] text-overflow-safe"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.125rem)' }}
          >
            {t('contact.description')}
          </motion.p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 bg-black safe-area-left safe-area-right">
        <div className="max-w-[min(1400px,95vw)] mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-800">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#FFDD00]">
                  {t('contact.sendMessage')}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-white/90">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/60 border rounded-xl px-4 py-3.5 text-white placeholder-white/60 focus:outline-none transition-all duration-300 ${
                        focusedField === 'name'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder={t('contact.form.namePlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-white/90">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all duration-300 ${
                        focusedField === 'email'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      placeholder={t('contact.form.emailPlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2 text-white/90">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none transition-all duration-300 ${
                        focusedField === 'phone'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                      placeholder={t('contact.form.phonePlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2 text-white/90">
                      {t('contact.form.service')}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('service')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-gray-800/60 border rounded-xl px-4 py-3.5 text-white focus:outline-none transition-all duration-300 ${
                        focusedField === 'service'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      required
                    >
                      <option value="">{t('contact.form.selectService')}</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-white/90">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                      className={`w-full bg-gray-800/60 border rounded-xl px-4 py-3.5 text-white placeholder-white/60 focus:outline-none transition-all duration-300 resize-none ${
                        focusedField === 'message'
                          ? 'border-[#FFDD00] shadow-lg shadow-[#FFDD00]/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      placeholder={t('contact.form.messagePlaceholder')}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#FFDD00] to-[#FFE640] text-black font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#FFDD00]/30 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
                    aria-label={isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  >
                    {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-[#FFDD00]">
                  {t('contact.contactInfo')}
                </h2>
                      <p className="text-white/85 mb-8 leading-relaxed">
                        {t('contact.contactInfoDescription')}
                      </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Phone */}
                <motion.a
                  href="tel:+966536137573"
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-700 hover:border-[#FFDD00]/60 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
                  aria-label={`Call us at ${t('contact.phoneNumber')}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#FFDD00]/10 flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9841 21.5573 21.2126 21.3522 21.3999C21.1472 21.5872 20.9054 21.7291 20.6424 21.8161C20.3794 21.9031 20.1012 21.9332 19.8262 21.9049C16.7427 21.5344 13.7487 20.5302 10.99 18.9399C8.39497 17.4672 6.18362 15.2559 4.71 12.6599C3.11972 9.90126 2.11552 6.90724 1.745 3.82393C1.71671 3.54889 1.74679 3.27072 1.83381 3.00772C1.92083 2.74472 2.06272 2.50291 2.25 2.29793C2.43729 2.09295 2.66578 1.92935 2.92075 1.81776C3.17572 1.70617 3.45146 1.64917 3.73 1.64993H6.73C7.36757 1.64628 7.97841 1.89119 8.43397 2.33193C8.88953 2.77267 9.15189 3.37159 9.16 4.00993C9.17737 5.06267 9.38842 6.10376 9.783 7.07993C9.94453 7.47903 10.0224 7.90926 10.0115 8.34193C10.0006 8.7746 9.90115 9.19942 9.72 9.58993L8.09 12.3099C9.51355 14.7763 11.7236 16.9864 14.19 18.4099L16.91 16.7799C17.3005 16.5988 17.7253 16.4994 18.158 16.4885C18.5907 16.4776 19.0209 16.5555 19.42 16.7169C20.3962 17.1115 21.4373 17.3226 22.49 17.3399C23.1301 17.3481 23.7307 17.6121 24.1707 18.0703C24.6107 18.5285 24.8534 19.1422 24.85 19.7799L22.85 19.7799" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{t('contact.phone')}</h3>
                      <p className="text-white/85">
                        <PhoneNumber phoneNumber={t('contact.phoneNumber')} />
                      </p>
                      <p className="text-white/85">{t('contact.available247')}</p>
                    </div>
                  </div>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/966536137573"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-700 hover:border-[#FFDD00]/60 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#FFDD00] focus-visible:outline-offset-2"
                  aria-label={`Contact us on WhatsApp at ${t('contact.phoneNumber')}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#FFDD00]/10 flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFDD00">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{t('contact.whatsapp')}</h3>
                      <p className="text-white/85">
                        <PhoneNumber phoneNumber={t('contact.phoneNumber')} />
                      </p>
                      <p className="text-white/85">{t('contact.quickResponse')}</p>
                    </div>
                  </div>
                </motion.a>

                {/* Location */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-[#FFDD00]/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#FFDD00]/10 flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{t('contact.location')}</h3>
                      <p className="text-white/85">{t('contact.locationCity')}</p>
                      <p className="text-white/85">{t('contact.locationService')}</p>
                    </div>
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="block bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800 hover:border-[#FFDD00]/50 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#FFDD00]/10 flex items-center justify-center flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFDD00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6V12L16 14" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{t('contact.workingHours')}</h3>
                      <p className="text-white/85">{t('contact.hours247')}</p>
                      <p className="text-white/85">{t('contact.emergencyService')}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}



















