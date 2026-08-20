import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../types';
import { ChevronLeft, ChevronRight, Factory, Maximize2, X, Cog } from 'lucide-react';

interface GallerySliderProps {
  title: string;
  subtitle: string;
  images: GalleryImage[];
}

export const GallerySlider: React.FC<GallerySliderProps> = ({
  title,
  subtitle,
  images,
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto horizontal scrolling effect at set interval
  useEffect(() => {
    if (isPaused || !scrollRef.current || !images || images.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;

        if (scrollLeft >= maxScroll - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, images]);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <section className="py-20 bg-white border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title and Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#0F3B68]/10 text-[#0F3B68] font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <Factory className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Instalaciones y Proyectos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h2>
            <p className="text-base text-gray-600 font-medium mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleScrollLeft}
              className="p-3 rounded-full border border-gray-200 hover:bg-[#0F3B68] hover:text-white hover:border-[#0F3B68] text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll Izquierda"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleScrollRight}
              className="p-3 rounded-full border border-gray-200 hover:bg-[#0F3B68] hover:text-white hover:border-[#0F3B68] text-gray-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Scroll Derecha"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Moving Scroll Container */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-center gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="flex-none w-[300px] sm:w-[380px] h-[260px] relative rounded-2xl overflow-hidden group cursor-pointer border border-gray-200 shadow-md snap-start transform transition-all duration-300 hover:scale-[1.02]"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-base tracking-tight drop-shadow-xs">{img.title}</p>
                  <p className="text-xs text-amber-400 font-semibold">Moldmaq S.A.</p>
                </div>
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-xs group-hover:bg-[#D97706] transition-colors">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-[70vh] object-contain bg-black"
            />
            <div className="p-4 bg-gray-900 text-white text-center">
              <h4 className="font-bold text-lg">{selectedImage.title}</h4>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

