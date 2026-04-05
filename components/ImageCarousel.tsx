"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageCarousel({ images, alt }: { images: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // reset touch end
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage(); // swipe left goes to next image
    }
    if (isRightSwipe) {
      prevImage(); // swipe right goes to previous image
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;
  if (images.length === 1) {
    return (
      <Image 
        src={images[0]} 
        alt={alt} 
        width={600} 
        height={600} 
        className="w-auto max-h-[40vh] md:max-h-[70vh] max-w-[70vw] md:max-w-[80vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] pointer-events-auto"
        priority
      />
    );
  }

  return (
    <div 
      className="relative group pointer-events-auto flex items-center justify-center touch-pan-y"
      onTouchStart={onTouchStart} 
      onTouchMove={onTouchMove} 
      onTouchEnd={onTouchEndHandler}
    >
      <button 
        onClick={prevImage}
        className="absolute left-[-2rem] md:left-[-4rem] z-30 p-2 md:p-3 rounded-full bg-white/50 backdrop-blur-md text-black hover:bg-white transition-colors md:opacity-0 group-hover:opacity-100 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <Image 
        key={currentIndex} // To trigger re-render and keep any CSS animations fresh
        src={images[currentIndex]} 
        alt={`${alt} view ${currentIndex + 1}`} 
        width={600} 
        height={600} 
        className="w-auto max-h-[40vh] md:max-h-[70vh] max-w-[70vw] md:max-w-[80vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-opacity duration-300"
        priority
      />

      <button 
        onClick={nextImage}
        className="absolute right-[-2rem] md:right-[-4rem] z-30 p-2 md:p-3 rounded-full bg-white/50 backdrop-blur-md text-black hover:bg-white transition-colors md:opacity-0 group-hover:opacity-100 shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-[-2rem] left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-black' : 'bg-black/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
