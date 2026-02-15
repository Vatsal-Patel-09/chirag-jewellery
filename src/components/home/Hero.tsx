"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const slides = [
  {
    image: "/images/slider/1.png",
    title: "Timeless Elegance",
    subtitle: "Discover our curated collection of handcrafted jewellery",
    cta: "Shop Now",
    link: "/products",
  },
  {
    image: "/images/slider/2.jpg",
    title: "New Arrivals",
    subtitle: "Explore the latest designs in gold, silver and diamond",
    cta: "View Collection",
    link: "/products?sort=newest",
  },
  {
    image: "/images/slider/3.jpg",
    title: "Festive Special",
    subtitle: "Celebrate every occasion with our exclusive pieces",
    cta: "Explore",
    link: "/products?featured=true",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, []);

  const prevSlide = () => {
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index: number) => {
    if (index !== current && !isAnimating) {
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative h-[85vh] overflow-hidden bg-stone-900">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className={`absolute inset-0 transition-transform duration-[8000ms] ease-linear ${index === current ? "scale-105" : "scale-100"}`}>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4 max-w-4xl">
              <div className={`transition-all duration-1000 delay-300 ${
                index === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-6 leading-tight tracking-wide drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl lg:text-2xl text-stone-100 mb-10 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.link}
                  className="inline-block border border-white/40 bg-white/10 backdrop-blur-sm text-white px-10 py-3 text-sm tracking-[0.2em] font-medium uppercase hover:bg-white hover:text-stone-900 transition-all duration-500 rounded-sm"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows (Minimal) */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 p-4"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 font-light" strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-20 p-4"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 font-light" strokeWidth={1} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={`transition-all duration-500 rounded-full border border-white/50 ${
              index === current
                ? "bg-white w-3 h-3 scale-110"
                : "bg-transparent w-3 h-3 hover:bg-white/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
