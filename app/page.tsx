"use client";
import Footer from "@/components/Footer";
import { useLayoutEffect, useEffect, useRef, lazy, Suspense, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene = lazy(() => import('@/components/Scene'));

if (typeof window !== 'undefined') {
  window.history.scrollRestoration = 'manual';
}

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [showSubtext, setShowSubtext] = useState(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);

  useEffect(() => {
    const text = '"A Soda for better you"';
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) {
        clearInterval(interval);
        setTimeout(() => setShowSubtext(true), 600);
        setTimeout(() => {
          window.history.scrollRestoration = 'manual';
          window.scrollTo(0, 0);
          gsap.to('.loading-overlay', {
            yPercent: -100, duration: 1.2, ease: 'power4.inOut',
            onComplete: () => setIsLoadingFinished(true)
          });
        }, 2800);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    if (!isLoadingFinished) return;

    const ctx = gsap.context(() => {
      gsap.to('.hero-bg', {
        scrollTrigger: { start: 50, end: 300, scrub: 1 },
        opacity: 0
      });

      gsap.from('.whatis-item', {
        scrollTrigger: { start: 50, end: 300, scrub: 3.5 },
        y: 60, opacity: 0, ease: 'power2.out'
      });

      ScrollTrigger.create({
        trigger: '#section-whatis',
        start: 'bottom bottom',
        end: '+=800',
        pin: true,
        pinSpacing: true
      });

      // YUZU
      gsap.from('.yuzu-head', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-desc', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-item', { scrollTrigger: { trigger: '#section-details', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });

      // BERRY
      gsap.from('.berry-head', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-desc', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-item', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });

      // SCROLL SCENE AWAY ON CTA
      gsap.to('.scene-container', {
        scrollTrigger: {
          trigger: '#section-cta',
          start: 'top bottom',
          end: 'top top',
          scrub: true
        },
        yPercent: -100,
        ease: 'none'
      });
    });

    return () => ctx.revert();
  }, [isLoadingFinished]);

  return (
    <main className="overflow-x-hidden bg-white">
      <style jsx global>{`
        @keyframes railway { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-railway { width: 200%; animation: railway 25s linear infinite; display: flex; }

        /* ✅ SOLID FILLED — no outline, just colour */
        .text-fill-yuzu  { color: #FFD600; -webkit-text-stroke: 0; }
        .text-fill-berry { color: #E84E1B; -webkit-text-stroke: 0; }

        .zero-card {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 20px; padding: 20px 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.06);
          transition: box-shadow 0.3s ease;
        }
        .zero-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.10); }
        .zero-card .zero-number {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 42px; font-weight: 900; line-height: 1;
          color: #111; letter-spacing: -0.03em;
        }
        .zero-card .zero-label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #666; margin-top: 4px;
        }

        @media (max-width: 768px) {
          .zero-card { padding: 14px 18px; border-radius: 14px; }
          .zero-card .zero-number { font-size: 28px; }
          .zero-card .zero-label  { font-size: 9px; }
        }
      `}</style>

      {/* LOADING OVERLAY */}
      <div className="loading-overlay fixed inset-0 z-[9999] bg-[#ffffff] flex flex-col items-center justify-center px-6">
        <h1 className="font-sans text-3xl md:text-5xl text-black font-medium text-center h-12">
          {typedText}<span className="animate-pulse">|</span>
        </h1>
        <p className={`mt-6 font-sans text-xs md:text-sm text-gray-400 tracking-widest uppercase transition-opacity duration-1000 ${showSubtext ? 'opacity-100' : 'opacity-0'}`}>
          -Crafted by a pharmacist and a chef. For Bharat.
        </p>
      </div>

      {/* BACKGROUND */}
      <div id="bg-layer" className="fixed inset-0 z-0 transition-colors duration-700" style={{ backgroundColor: '#ffffff' }}>
        <img src="/hero.jpg" alt="Hero" className="hero-bg absolute inset-0 w-full h-full object-cover opacity-70" />
      </div>

      {/* 3D SCENE */}
      <Suspense fallback={null}>
        <div className="scene-container fixed inset-0 z-[10] pointer-events-none">
          <Scene flavor={undefined} />
        </div>
      </Suspense>

      <div ref={mainRef} className="relative text-black">

        {/* SECTION 1: HERO */}
        <section id="section-whatis" className="relative flex flex-col items-center justify-end px-6 md:px-16 overflow-hidden pb-12 md:pb-16" style={{ height: 'calc(100vh + 300px)' }}>
          <div id="about-anchor" className="whatis-item max-w-[700px] w-full text-center z-[5] pointer-events-none relative mt-auto">
            <p className="font-sans font-bold text-[11px] md:text-[13px] text-black leading-relaxed md:leading-[1.8]">
              Dang is crafted with one simple philosophy — "the rest is zero."
0 added sugar. 0 preservatives. 0 artificial colours. 0 caffeine. 0 stabilizers. 0 colorants.
Every element is thoughtfully chosen to deliver a purer, more genuine experience. Naturally lactose-free and 100% vegan-friendly, Dang is clean living in every sip.
            </p>
          </div>
        </section>

        {/* SECTION 2: YUZU */}
        <section id="section-details" className="relative min-h-screen md:h-screen flex items-center px-4 md:px-16 overflow-hidden py-20 md:py-0">

          {/* ✅ Marquee — solid filled yellow, no outline */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-30 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-fill-yuzu px-8">
                YU ZU&nbsp;&nbsp;•&nbsp;&nbsp;YU ZU&nbsp;&nbsp;•&nbsp;&nbsp;
              </div>
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-fill-yuzu px-8">
                YU ZU&nbsp;&nbsp;•&nbsp;&nbsp;YU ZU&nbsp;&nbsp;•&nbsp;&nbsp;
              </div>
            </div>
          </div>

          {/* ✅ MOBILE: desc and tags pushed to BOTTOM — free space below the 3D can */}
          <div className="md:hidden flex flex-col w-full z-[20] pointer-events-none" style={{ minHeight: '100vh', justifyContent: 'flex-end', paddingBottom: '40px' }}>
            <div className="yuzu-head mb-3">
              <h2 className="font-sans font-black text-5xl tracking-tighter uppercase text-[#FFD600]">Yu zu</h2>
              <p className="font-sans font-light text-sm text-gray-500 mt-1">(Bright. Crisp. Authentic)</p>
            </div>
            <div className="yuzu-desc mb-4">
              <p className="font-sans font-light text-xs text-gray-800 leading-relaxed bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                The kind of citrus that doesn't apologise for itself. Yu zu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.
              </p>
            </div>
            <div className="yuzu-item flex flex-row flex-wrap gap-2">
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20">Zero Added Sugar</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20">5g Prebiotic Fiber</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20">Extra Crispy</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20">No Preservative</span>
            </div>
          </div>

          {/* DESKTOP layout — unchanged */}
          <div className="yuzu-head hidden md:block absolute left-16 top-[25%] w-[40%] max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-8xl tracking-tighter uppercase text-[#FFD600]">Yu zu</h2>
            <p className="font-sans font-light text-xl text-gray-500 mt-2">(Bright. Crisp. Authentic)</p>
          </div>

          <div className="yuzu-desc hidden md:flex absolute right-16 bottom-[25%] w-[45%] max-w-[400px] z-[20] pointer-events-none flex-col items-end text-right">
            <p className="font-sans font-light text-base text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
              The kind of citrus that doesn't apologise for itself. Yu zu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.
            </p>
          </div>

          <div className="yuzu-item hidden md:flex absolute left-16 bottom-[35%] z-[20] pointer-events-none flex-col gap-4">
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-5 py-3 rounded-full shadow-sm border border-[#00A343]/20 text-center">Zero Added Sugar</span>
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-5 py-3 rounded-full shadow-sm border border-[#00A343]/20 text-center">5g Prebiotic Fiber</span>
          </div>

          <div className="yuzu-item hidden md:flex absolute right-16 top-[35%] z-[20] pointer-events-none flex-col items-end gap-4">
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-5 py-3 rounded-full shadow-sm border border-[#00A343]/20 text-center">Extra Crispy</span>
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-5 py-3 rounded-full shadow-sm border border-[#00A343]/20 text-center">No Preservative</span>
          </div>
        </section>

        {/* SECTION 3: BERRY */}
        <section id="section-ingredients" className="relative min-h-screen md:h-screen flex items-center px-4 md:px-16 overflow-hidden py-20 md:py-0">

          {/* ✅ Marquee — solid filled orange-red, no outline */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-30 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-fill-berry px-8">
                BERRY&nbsp;&nbsp;•&nbsp;&nbsp;BERRY&nbsp;&nbsp;•&nbsp;&nbsp;
              </div>
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-fill-berry px-8">
                BERRY&nbsp;&nbsp;•&nbsp;&nbsp;BERRY&nbsp;&nbsp;•&nbsp;&nbsp;
              </div>
            </div>
          </div>

          {/* ✅ MOBILE: desc and tags pushed to BOTTOM */}
          <div className="md:hidden flex flex-col w-full z-[20] pointer-events-none" style={{ minHeight: '100vh', justifyContent: 'flex-end', paddingBottom: '40px' }}>
            <div className="berry-head mb-3">
              <h2 className="font-sans font-black text-5xl tracking-tighter uppercase text-[#E84E1B]">Berry</h2>
              <p className="font-sans font-light text-sm text-gray-500 mt-1">(Bold. Real. Fizzy)</p>
            </div>
            <div className="berry-desc mb-4">
              <p className="font-sans font-light text-xs text-gray-800 leading-relaxed bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                Blueberry meets strawberry. No drama, no artificial interference. Just two fruits doing what they do best and 5g of prebiotic fibre doing the rest.
              </p>
            </div>
            <div className="berry-item flex flex-row flex-wrap gap-2">
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20">Zero Added Sugar</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20">5g Prebiotic Fiber</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20">Extra Crispy</span>
              <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20">No Preservative</span>
            </div>
          </div>

          {/* DESKTOP layout — unchanged */}
          <div className="berry-head hidden md:block absolute left-16 top-[25%] w-[40%] max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-8xl tracking-tighter uppercase text-[#E84E1B]">Berry</h2>
            <p className="font-sans font-light text-xl text-gray-500 mt-2">(Bold. Real. Fizzy)</p>
          </div>

          <div className="berry-desc hidden md:flex absolute right-16 bottom-[25%] w-[45%] max-w-[400px] z-[20] pointer-events-none flex-col items-end text-right">
            <p className="font-sans font-light text-base text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
              Blueberry meets strawberry. No drama, no artificial interference. Just two fruits doing what they do best and 5g of prebiotic fibre doing the rest.
            </p>
          </div>

          <div className="berry-item hidden md:flex absolute left-16 bottom-[35%] z-[20] pointer-events-none flex-col gap-4">
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-5 py-3 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">Zero Added Sugar</span>
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-5 py-3 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">5g Prebiotic Fiber</span>
          </div>

          <div className="berry-item hidden md:flex absolute right-16 top-[35%] z-[20] pointer-events-none flex-col items-end gap-4">
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-5 py-3 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">Extra Crispy</span>
            <span className="font-sans font-bold text-sm tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-5 py-3 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">No Preservative</span>
          </div>
        </section>

        {/* SECTION 4: CTA */}
        <section id="section-cta" className="relative h-screen flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
          <div className="cta-content text-center z-[20] relative cursor-auto max-w-5xl w-full px-4 md:px-8">
            <h3 className="font-sans font-bold text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-6 md:mb-8">[ WHY DANG ]</h3>
            <p className="font-sans text-3xl md:text-5xl lg:text-[4.5rem] text-black font-medium mb-10 md:mb-14 leading-tight tracking-tight">
              A pharmacist knew what the body needs. A chef knew what it wants.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 md:px-10 py-3 md:py-4 bg-black text-white rounded-full font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-gray-800 transition-all hover:scale-105"
            >
              Contact Us
            </a>
            <h3 className="font-sans font-bold text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase mt-6 md:mt-8">[ BEST SERVED COLD ]</h3>
          </div>
        </section>

      </div>

      <Footer />
    </main>
  );
};

export default Index;