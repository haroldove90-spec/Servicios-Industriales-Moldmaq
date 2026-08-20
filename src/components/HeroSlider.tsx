import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSliderProps {
  slides: HeroSlide[];
  whatsappNumber: string;
  defaultMessage: string;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  whatsappNumber,
  defaultMessage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.7 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <section id="inicio" className="relative w-full h-[520px] sm:h-[600px] lg:h-[650px] overflow-hidden bg-gray-900 text-white">
      {/* Slide Image Container with Motion Effect */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Dark Overlay for Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4 sm:space-y-6">
          <motion.div
            key={`badge-${currentIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 text-white/90 text-xs sm:text-sm font-medium uppercase tracking-widest mb-1"
          >
            <span className="text-emerald-400 font-bold">Mudanzas Profesionales</span>
            <span className="opacity-50">•</span>
            <span>Servicio 365 Días</span>
          </motion.div>

          <motion.h1
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight drop-shadow-md"
          >
            {currentSlide.title}
          </motion.h1>

          <motion.p
            key={`subtitle-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm sm:text-lg text-gray-200 font-normal leading-relaxed drop-shadow-xs max-w-xl"
          >
            {currentSlide.subtitle}
          </motion.p>

          <motion.div
            key={`btn-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="pt-2 flex flex-wrap gap-3 sm:gap-4"
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 sm:gap-2.5 bg-[#1D7946] hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-md transition-all shadow-lg hover:shadow-emerald-900/40"
            >
              <WhatsAppIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
              <span>{currentSlide.buttonText || "WhatsApp Directo"}</span>
            </a>

            <a
              href="#servicios"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-xs sm:text-sm border border-white/30 px-5 sm:px-6 py-2.5 sm:py-3 rounded-md transition-all"
            >
              Ver Servicios
            </a>
          </motion.div>
        </div>
      </div>

      {/* Desktop Navigation Arrow Controls */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#0E5197] text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 border border-white/10 cursor-pointer"
        aria-label="Anterior Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-[#0E5197] text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 border border-white/10 cursor-pointer"
        aria-label="Siguiente Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Mobile Navigation Controls (Bottom Right Capsule) */}
      <div className="md:hidden absolute bottom-5 right-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Anterior Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-3 bg-white/30" />
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Siguiente Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators / Pill Dots */}
      <div className="absolute bottom-5 sm:bottom-6 left-4 sm:left-1/2 sm:-translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`transition-all rounded-full ${
              idx === currentIndex
                ? 'w-8 h-1 bg-white'
                : 'w-8 h-1 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
