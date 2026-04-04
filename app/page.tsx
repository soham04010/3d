"use client";
import { useLayoutEffect, useEffect, useRef, lazy, Suspense, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene = lazy(() => import('@/components/Scene'));

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Loading & Form States
  const [typedText, setTypedText] = useState("");
  const [showSubtext, setShowSubtext] = useState(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(""); 
  const [isError, setIsError] = useState(false);

  // TYPEWRITER LOADING LOGIC
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
          gsap.to('.loading-overlay', {
            yPercent: -100,
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => setIsLoadingFinished(true)
          });
          gsap.from('.hero-left', { x: -50, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 });
          gsap.from('.hero-right', { x: 50, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.4 });
        }, 2800); 
      }
    }, 70); 
    return () => clearInterval(interval);
  }, []);

  // Web3Forms Submission Logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("Sending...");
    setIsError(false);
    
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE");

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const data = await response.json();

      if (data.success) {
        setSubmitStatus("Sent successfully!");
        event.currentTarget.reset();
        setTimeout(() => { setIsFormOpen(false); setSubmitStatus(""); }, 2000);
      } else {
        setIsError(true);
        setSubmitStatus("Failed to send. Please try again.");
      }
    } catch (error) {
      setIsError(true);
      setSubmitStatus("Failed to send. Network error.");
    }
  };

  // Custom Minimal Cursor
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  useLayoutEffect(() => {
    if (!isLoadingFinished) return; 

    const ctx = gsap.context(() => {
      // Hero Image Fade Out
      gsap.to('.hero-bg', {
        scrollTrigger: { trigger: '#section-whatis', start: 'top bottom', end: 'top center', scrub: 1 },
        opacity: 0
      });

      // WHAT IS DANG - Simple fade in, no complex scrub delays
      gsap.from('.whatis-item', {
        scrollTrigger: { trigger: '#section-whatis', start: 'top 70%', end: 'center center', scrub: 1 },
        y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out'
      });

      // YUZU Animations
      gsap.from('.yuzu-head', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-desc', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-item', { scrollTrigger: { trigger: '#section-details', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });

      // BERRY Animations
      gsap.from('.berry-head', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-desc', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-item', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });
    }); 
    
    return () => ctx.revert();
  }, [isLoadingFinished]);

  return (
    <main className="overflow-x-hidden bg-white">
      <style jsx global>{` 
        body { cursor: none; } 
        @keyframes railway { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-railway { width: 200%; animation: railway 25s linear infinite; display: flex; }
        .text-outline-yuzu { -webkit-text-stroke: 2px #dce882; color: transparent; }
        .text-outline-berry { -webkit-text-stroke: 2px #f2a7b8; color: transparent; }
      `}</style>

      {/* ===== LOADING OVERLAY ===== */}
      <div className="loading-overlay fixed inset-0 z-[9999] bg-[#ffffff] flex flex-col items-center justify-center px-6">
        <h1 className="font-serif text-3xl md:text-5xl text-black font-medium text-center h-12">
          {typedText}
          <span className="animate-pulse">|</span>
        </h1>
        <p className={`mt-6 font-sans text-xs md:text-sm text-gray-400 tracking-widest uppercase transition-opacity duration-1000 ${showSubtext ? 'opacity-100' : 'opacity-0'}`}>
          -Crafted by a pharmacist and a chef. For Bharat.
        </p>
      </div>

      <div ref={cursorRef} className="fixed top-0 left-0 w-3 h-3 bg-black rounded-full pointer-events-none z-[999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block" />

      {/* MINIMALIST BACKGROUND + HERO IMAGE (More visible now) */}
      <div id="bg-layer" className="fixed inset-0 z-0 transition-colors duration-700" style={{ backgroundColor: '#ffffff' }}>
        <img src="/hero.jpg" alt="Hero" className="hero-bg absolute inset-0 w-full h-full object-cover opacity-70" />
      </div>

      {/* 3D SCENE (z-10) */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-[10] pointer-events-none">
          <Scene />
        </div>
      </Suspense>

      {/* SCROLLING CONTENT WRAPPER */}
      <div ref={mainRef} className="relative text-black cursor-none">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section id="section-hero" className="relative h-screen flex items-center px-6 md:px-16">
          <div className="hero-left absolute left-4 md:left-16 w-[40%] md:max-w-[400px] z-[20] pointer-events-none">
            <h1 className="font-sans font-black text-5xl md:text-[8rem] leading-[0.8] tracking-tighter text-black uppercase">Dang</h1>
            <h1 className="font-sans font-black text-5xl md:text-[8rem] leading-[0.8] tracking-tighter text-black uppercase">Soda</h1>
          </div>

          <div className="hero-right absolute right-4 md:right-16 w-[45%] md:max-w-[400px] z-[20] pointer-events-none flex flex-col items-end text-right">
            <p className="font-serif text-lg md:text-3xl italic text-gray-900 font-bold drop-shadow-md">
              "A Soda for better you"
            </p>
            <div className="mt-4 border border-gray-300 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-widest text-black bg-white/80 backdrop-blur-md uppercase">
              -Crafted by a pharmacist and a chef. For Bharat.
            </div>
          </div>
        </section>

        {/* ===== SECTION 1.5: WHAT IS DANG (Normal h-screen, no scroll lock) ===== */}
        <section id="section-whatis" className="relative h-screen flex items-center px-6 md:px-16 overflow-hidden">
           {/* LEFT HEADING: Strict 35% width max */}
           <div className="whatis-item absolute left-6 md:left-16 w-[35%] md:max-w-[300px] z-[20] pointer-events-none">
             <h2 className="font-sans font-black tracking-[0.1em] text-base md:text-3xl text-black uppercase">
               What is Dang?
             </h2>
           </div>

           {/* RIGHT TEXT: Strict 45% width max to avoid bottle */}
           <div className="absolute right-6 md:right-16 w-[45%] md:max-w-[450px] z-[20] pointer-events-none flex flex-col justify-center gap-6 text-right md:text-left">
              <div className="whatis-item">
                 <p className="font-serif italic font-bold text-2xl md:text-4xl text-black leading-relaxed">
                   Your first soda memory. Your kid's after-school reach. Your parents' evening ritual.
                 </p>
              </div>
              <div className="whatis-item">
                 <p className="font-sans font-medium text-base md:text-xl text-black leading-relaxed">
                   Some things should work for everyone — at every age, in every moment. That's exactly what we set out to build.
                 </p>
              </div>
              <div className="whatis-item">
                 <p className="font-sans font-black text-xl md:text-3xl uppercase text-black tracking-tight">
                   No asterisks. No exceptions.
                 </p>
              </div>
           </div>
        </section>

        {/* ===== SECTION 2: YUZU ===== */}
        <section id="section-details" className="relative h-screen flex items-center px-6 md:px-16 overflow-hidden">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-40 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[25vw] font-black tracking-tighter text-outline-yuzu px-8">
                YUZU CITRUS • YUZU CITRUS • 
              </div>
              <div className="whitespace-nowrap text-[25vw] font-black tracking-tighter text-outline-yuzu px-8">
                YUZU CITRUS • YUZU CITRUS • 
              </div>
            </div>
          </div>

          <div className="yuzu-head absolute left-4 md:left-16 top-[15%] md:top-[25%] w-[40%] md:max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-6xl md:text-8xl tracking-tighter uppercase text-black drop-shadow-[5px_5px_0px_#dce882]">Yuzu</h2>
            <p className="font-serif italic text-sm md:text-xl text-gray-500 mt-2">(Bright. Crisp. Authentic)</p>
          </div>
          
          <div className="yuzu-desc absolute right-4 md:right-16 bottom-[15%] md:bottom-[25%] w-[45%] md:max-w-[400px] z-[20] pointer-events-none flex flex-col items-end text-right">
            <p className="font-sans font-light text-xs md:text-base text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
              The kind of citrus that doesn't apologise for itself. Yuzu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.
            </p>
          </div>

          <div className="yuzu-item absolute left-4 md:left-16 bottom-[25%] md:bottom-[35%] z-[20] pointer-events-none flex flex-col gap-4">
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#f4f7e6] text-[#8ca32e] px-5 py-3 rounded-full shadow-sm border border-[#8ca32e]/20 text-center">Zero Added Sugar</span>
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#f4f7e6] text-[#8ca32e] px-5 py-3 rounded-full shadow-sm border border-[#8ca32e]/20 text-center">5g Prebiotic Fiber</span>
          </div>

          <div className="yuzu-item absolute right-4 md:right-16 top-[25%] md:top-[35%] z-[20] pointer-events-none flex flex-col items-end gap-4">
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#f4f7e6] text-[#8ca32e] px-5 py-3 rounded-full shadow-sm border border-[#8ca32e]/20 text-center">Extra Crispy</span>
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#f4f7e6] text-[#8ca32e] px-5 py-3 rounded-full shadow-sm border border-[#8ca32e]/20 text-center">No Preservative</span>
          </div>
        </section>

        {/* ===== SECTION 3: BERRY ===== */}
        <section id="section-ingredients" className="relative h-screen flex items-center px-6 md:px-16 overflow-hidden">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-40 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[25vw] font-black tracking-tighter text-outline-berry px-8">
                BERRY BLAST • BERRY BLAST • 
              </div>
              <div className="whitespace-nowrap text-[25vw] font-black tracking-tighter text-outline-berry px-8">
                BERRY BLAST • BERRY BLAST • 
              </div>
            </div>
          </div>

          <div className="berry-head absolute left-4 md:left-16 top-[15%] md:top-[25%] w-[40%] md:max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-6xl md:text-8xl tracking-tighter uppercase text-black drop-shadow-[5px_5px_0px_#f2a7b8]">Berry</h2>
            <p className="font-serif italic text-sm md:text-xl text-gray-500 mt-2">(Bold. Real. Fizzy)</p>
          </div>
          
          <div className="berry-desc absolute right-4 md:right-16 bottom-[15%] md:bottom-[25%] w-[45%] md:max-w-[400px] z-[20] pointer-events-none flex flex-col items-end text-right">
            <p className="font-sans font-light text-xs md:text-base text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
              Blueberry meets strawberry. No drama, no artificial interference. Just two fruits doing what they do best and 5g of prebiotic fibre doing the rest.
            </p>
          </div>

          <div className="berry-item absolute left-4 md:left-16 bottom-[25%] md:bottom-[35%] z-[20] pointer-events-none flex flex-col gap-4">
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#fcf0f5] text-[#d45d79] px-5 py-3 rounded-full shadow-sm border border-[#d45d79]/20 text-center">Zero Added Sugar</span>
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#fcf0f5] text-[#d45d79] px-5 py-3 rounded-full shadow-sm border border-[#d45d79]/20 text-center">5g Prebiotic Fiber</span>
          </div>

          <div className="berry-item absolute right-4 md:right-16 top-[25%] md:top-[35%] z-[20] pointer-events-none flex flex-col items-end gap-4">
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#fcf0f5] text-[#d45d79] px-5 py-3 rounded-full shadow-sm border border-[#d45d79]/20 text-center">Extra Crispy</span>
             <span className="font-sans font-bold text-[10px] md:text-sm tracking-widest uppercase bg-[#fcf0f5] text-[#d45d79] px-5 py-3 rounded-full shadow-sm border border-[#d45d79]/20 text-center">No Preservative</span>
          </div>
        </section>

        {/* ===== SECTION 4: CTA ===== */}
        <section id="section-cta" className="relative h-screen flex flex-col items-center justify-end pb-16 overflow-hidden">
          <div className="cta-content text-center z-[20] relative cursor-auto max-w-2xl px-6">
            <h3 className="font-sans font-bold text-xs tracking-widest text-gray-400 uppercase mb-4">[ WHY DANG ]</h3>
            <p className="font-serif italic text-2xl md:text-4xl text-black mb-10 leading-tight">
              A pharmacist knew what the body needs. A chef knew what it wants.
            </p>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-10 py-4 bg-black text-white rounded-full font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-gray-800 transition-all hover:scale-105"
              style={{ cursor: 'none' }} 
            >
              Contact Us
            </button>
            <h3 className="font-sans font-bold text-[10px] tracking-widest text-gray-400 uppercase mt-8">[ BEST SERVED COLD ]</h3>
          </div>
        </section>

      </div>

      {/* ===== CONTACT MODAL ===== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md px-4 cursor-auto">
          <div className="bg-white p-8 md:p-12 rounded-2xl w-full max-w-md relative shadow-2xl border border-gray-100">
            <button onClick={() => { setIsFormOpen(false); setSubmitStatus(""); }} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-2xl font-sans font-black mb-2 text-black">Drop a line.</h2>
            <p className="text-gray-400 text-sm mb-6 font-serif italic">For the person who makes the smart choice.</p>
            
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input type="text" name="name" required placeholder="Name" className="p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
              <input type="email" name="email" required placeholder="Email" className="p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
              <textarea name="message" required placeholder="What's up?" rows={4} className="p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors resize-none" />
              <input type="hidden" name="subject" value="New Website Submission for Dang Soda" />
              <button type="submit" className="bg-black text-white font-sans font-medium text-xs tracking-widest uppercase py-4 rounded-lg mt-2 hover:bg-gray-800 transition-colors">
                Send Message
              </button>
              {submitStatus && <div className={`mt-2 font-sans font-medium text-center text-xs ${isError ? 'text-red-500' : 'text-green-600'}`}>{submitStatus}</div>}
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;