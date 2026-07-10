import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Instagram } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Slide } from '@workspace/api-client-react';

interface HeroCarouselProps {
  slides: Slide[];
  instagramUrl?: string;
}

export function HeroCarousel({ slides, instagramUrl }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return undefined;
    const currentSlide = slides[currentIndex];
    if (currentSlide.autoplay) {
      const timer = setInterval(goToNext, currentSlide.autoplaySpeed || 5000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [currentIndex, slides, goToNext]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-secondary">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            )}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-secondary">
              <img
                src={slide.imageUrl}
                alt={slide.heading}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-[10000ms] ease-out",
                  isActive ? "scale-105" : "scale-100"
                )}
              />
            </div>
            
            {/* Overlay */}
            <div 
              className="absolute inset-0"
              style={{ backgroundColor: `rgba(0, 12, 38, ${slide.overlayOpacity / 100})` }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 text-white z-20">
              <div 
                className={cn(
                  "max-w-4xl transition-all duration-1000 transform",
                  isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-8 opacity-0"
                )}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg">
                  {slide.heading}
                </h1>
                {slide.description && (
                  <p className="mt-4 text-xl sm:text-2xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow-md">
                    {slide.description}
                  </p>
                )}
                
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="#contact" className="group">
                    <Button size="lg" className="rounded-full px-8 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-1 w-full sm:w-auto h-14 text-lg">
                      Book via WhatsApp
                    </Button>
                  </a>
                  <a
                    href={instagramUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <button className="flex items-center gap-2.5 rounded-full px-8 h-14 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto" style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                      <Instagram className="w-5 h-5" />
                      Follow on Instagram
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all focus:outline-none"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all focus:outline-none"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 focus:outline-none",
                  index === currentIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
