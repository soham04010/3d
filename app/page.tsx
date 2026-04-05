"use client";
import { useLayoutEffect, useEffect, useRef, lazy, Suspense, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene = lazy(() => import('@/components/Scene'));

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  
  const [typedText, setTypedText] = useState("");
  const [showSubtext, setShowSubtext] = useState(false);
  const [isLoadingFinished, setIsLoadingFinished] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(""); 
  const [isError, setIsError] = useState(false);

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
            yPercent: -100, duration: 1.2, ease: 'power4.inOut',
            onComplete: () => setIsLoadingFinished(true)
          });
        }, 2800); 
      }
    }, 70); 
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitStatus("Sending...");
    setIsError(false);
    
    const formData = new FormData(form);
    formData.append("access_key", "2671cc0e-e509-42d7-a527-f3a2e1d06c81");
    
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const data = await response.json();

      if (data.success) {
        setSubmitStatus("Sent successfully!");
        form.reset();
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


  useLayoutEffect(() => {
    if (!isLoadingFinished) return; 

    const ctx = gsap.context(() => {
      gsap.to('.hero-bg', {
        scrollTrigger: { trigger: '#section-whatis', start: 'top bottom', end: 'top center', scrub: 1 },
        opacity: 0
      });

      // Hero background fade out when scrolling to What is Dang

      gsap.from('.whatis-item', {
        scrollTrigger: { trigger: '#section-whatis', start: 'top 70%', end: 'center center', scrub: 1 },
        y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out'
      });

      // YUZU
      gsap.from('.yuzu-head', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-desc', { scrollTrigger: { trigger: '#section-details', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.yuzu-item', { scrollTrigger: { trigger: '#section-details', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });

      // BERRY
      gsap.from('.berry-head', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: -50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-desc', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 60%', end: 'center center', scrub: 1 }, x: 50, opacity: 0, ease: 'power2.out' });
      gsap.from('.berry-item', { scrollTrigger: { trigger: '#section-ingredients', start: 'top 50%', end: 'center center', scrub: 1 }, y: 30, opacity: 0, stagger: 0.15, ease: 'power2.out' });
    }); 
    
    return () => ctx.revert();
  }, [isLoadingFinished]);

  return (
    <main className="overflow-x-hidden bg-white">
      <style jsx global>{` 
        @keyframes railway { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-railway { width: 200%; animation: railway 25s linear infinite; display: flex; }
        .text-outline-yuzu { -webkit-text-stroke: 2px #FFD600; color: transparent; }
        .text-outline-berry { -webkit-text-stroke: 2px #E84E1B; color: transparent; }
        
        /* ===== HERO ZERO CARDS STYLING ===== */
        .zero-card {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          padding: 20px 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          transition: box-shadow 0.3s ease;
        }
        .zero-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.10);
        }
        .zero-card .zero-number {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 42px;
          font-weight: 900;
          line-height: 1;
          color: #111;
          letter-spacing: -0.03em;
        }
        .zero-card .zero-label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #666;
          margin-top: 4px;
        }
        
        @media (max-width: 768px) {
          .zero-card {
            padding: 14px 18px;
            border-radius: 14px;
          }
          .zero-card .zero-number {
            font-size: 28px;
          }
          .zero-card .zero-label {
            font-size: 9px;
          }
          .text-outline-yuzu { -webkit-text-stroke: 1px #FFD600; }
          .text-outline-berry { -webkit-text-stroke: 1px #E84E1B; }
        }
      `}</style>

      {/* ===== LOADING OVERLAY ===== */}
      <div className="loading-overlay fixed inset-0 z-[9999] bg-[#ffffff] flex flex-col items-center justify-center px-6">
        <h1 className="font-sans text-3xl md:text-5xl text-black font-medium text-center h-12">
          {typedText}
          <span className="animate-pulse">|</span>
        </h1>
        <p className={`mt-6 font-sans text-xs md:text-sm text-gray-400 tracking-widest uppercase transition-opacity duration-1000 ${showSubtext ? 'opacity-100' : 'opacity-0'}`}>
          -Crafted by a pharmacist and a chef. For Bharat.
        </p>
      </div>


      {/* MINIMALIST BACKGROUND + HERO IMAGE */}
      <div id="bg-layer" className="fixed inset-0 z-0 transition-colors duration-700" style={{ backgroundColor: '#ffffff' }}>
        <img src="/hero.jpg" alt="Hero" className="hero-bg absolute inset-0 w-full h-full object-cover opacity-70" />
      </div>

      {/* 3D SCENE (z-10) */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 z-[10] pointer-events-none">
          <Scene flavor={undefined} />
        </div>
      </Suspense>

      <div ref={mainRef} className="relative text-black">
        
        {/* ===== SECTION 1: HERO ===== */}
        <section id="section-hero" className="relative min-h-[80vh] md:min-h-screen">
          {/* Empty section to allow scrolling past the 3D bottle which stays fixed in the background */}
        </section>

        {/* ===== SECTION 1.5: WHAT IS DANG ===== */}
        <section id="section-whatis" className="relative min-h-screen md:h-screen flex items-center px-6 md:px-16 overflow-hidden py-24 md:py-0">
           {/* MOBILE: Stacked layout / DESKTOP: absolute split layout */}
           <div className="md:hidden flex flex-col gap-6 w-full z-[20] pointer-events-none">
             <div className="whatis-item">
               <h2 className="font-sans font-black tracking-[0.1em] text-xl text-black uppercase">
                 What is Dang?
               </h2>
             </div>
             <div className="whatis-item">
               <p className="font-sans font-medium text-xl text-black leading-relaxed">
                 Your first soda memory. Your kid's after-school reach. Your parents' evening ritual.
               </p>
             </div>
             <div className="whatis-item">
               <p className="font-sans font-medium text-sm text-black leading-relaxed">
                 Dang has been crafted with the goal of "the rest is zero". 0 added sugar, 0 Preservatives, 0 Colour, 0 caffinene, 0 stablizers, without colorants to make the experience even purer and more genuine. All elements are naturally lactose-free and vegan friendly.
               </p>
             </div>
             <div className="whatis-item">
               <p className="font-sans font-black text-lg uppercase text-black tracking-tight">
                 No asterisks. No exceptions.
               </p>
             </div>
           </div>

           {/* DESKTOP: original absolute layout */}
           <div className="whatis-item hidden md:block absolute left-16 w-[35%] max-w-[300px] z-[20] pointer-events-none">
             <h2 className="font-sans font-black tracking-[0.1em] text-3xl text-black uppercase">
               What is Dang?
             </h2>
           </div>

           <div className="hidden md:flex absolute right-16 w-[45%] max-w-[450px] z-[20] pointer-events-none flex-col justify-center gap-6 text-left">
              <div className="whatis-item">
                 <p className="font-sans font-medium text-4xl text-black leading-relaxed">
                   Your first soda memory. Your kid's after-school reach. Your parents' evening ritual.
                 </p>
              </div>
              <div className="whatis-item">
                 <p className="font-sans font-medium text-xl text-black leading-relaxed">
                   Some things should work for everyone — at every age, in every moment. That's exactly what we set out to build.
                 </p>
              </div>
              <div className="whatis-item">
                 <p className="font-sans font-black text-3xl uppercase text-black tracking-tight">
                   No asterisks. No exceptions.
                 </p>
              </div>
           </div>
        </section>

        {/* ===== SECTION 2: YUZU ===== */}
        <section id="section-details" className="relative min-h-screen md:h-screen flex items-center px-4 md:px-16 overflow-hidden py-20 md:py-0">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-40 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-outline-yuzu px-8">
                YUZU  • YUZU  • 
              </div>
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-outline-yuzu px-8">
                YUZU  • YUZU  • 
              </div>
            </div>
          </div>

          {/* MOBILE: stacked flow layout */}
          <div className="md:hidden flex flex-col gap-5 w-full z-[20] pointer-events-none">
            <div className="yuzu-head">
              <h2 className="font-sans font-black text-5xl tracking-tighter uppercase text-black drop-shadow-[3px_3px_0px_#FFD600]">Yuzu</h2>
              <p className="font-sans text-sm text-gray-500 mt-1">(Bright. Crisp. Authentic)</p>
            </div>
            <div className="yuzu-desc">
              <p className="font-sans font-light text-xs text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                The kind of citrus that doesn't apologise for itself. Yuzu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.
              </p>
            </div>
            <div className="yuzu-item flex flex-row flex-wrap gap-2">
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20 text-center">Zero Added Sugar</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20 text-center">5g Prebiotic Fiber</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20 text-center">Extra Crispy</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F4FAF5] text-[#00A343] px-4 py-2 rounded-full shadow-sm border border-[#00A343]/20 text-center">No Preservative</span>
            </div>
          </div>

          {/* DESKTOP: absolute positioned layout */}
          <div className="yuzu-head hidden md:block absolute left-16 top-[25%] w-[40%] max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-8xl tracking-tighter uppercase text-black drop-shadow-[5px_5px_0px_#FFD600]">Yuzu</h2>
            <p className="font-sans text-xl text-gray-500 mt-2">(Bright. Crisp. Authentic)</p>
          </div>
          
          <div className="yuzu-desc hidden md:flex absolute right-16 bottom-[25%] w-[45%] max-w-[400px] z-[20] pointer-events-none flex-col items-end text-right">
            <p className="font-sans font-light text-base text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white">
              The kind of citrus that doesn't apologise for itself. Yuzu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.
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

        {/* ===== SECTION 3: BERRY ===== */}
        <section id="section-ingredients" className="relative min-h-screen md:h-screen flex items-center px-4 md:px-16 overflow-hidden py-20 md:py-0">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full z-[5] pointer-events-none select-none opacity-40 overflow-hidden">
            <div className="animate-railway">
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-outline-berry px-8">
                BERRY  • BERRY  • 
              </div>
              <div className="whitespace-nowrap text-[30vw] md:text-[25vw] font-black tracking-tighter text-outline-berry px-8">
                BERRY  • BERRY  • 
              </div>
            </div>
          </div>

          {/* MOBILE: stacked flow layout */}
          <div className="md:hidden flex flex-col gap-5 w-full z-[20] pointer-events-none">
            <div className="berry-head">
              <h2 className="font-sans font-black text-5xl tracking-tighter uppercase text-black drop-shadow-[3px_3px_0px_#E84E1B]">Berry</h2>
              <p className="font-sans text-sm text-gray-500 mt-1">(Bold. Real. Fizzy)</p>
            </div>
            <div className="berry-desc">
              <p className="font-sans font-light text-xs text-gray-800 leading-relaxed bg-white/70 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white">
                Blueberry meets strawberry. No drama, no artificial interference. Just two fruits doing what they do best and 5g of prebiotic fibre doing the rest.
              </p>
            </div>
            <div className="berry-item flex flex-row flex-wrap gap-2">
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">Zero Added Sugar</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">5g Prebiotic Fiber</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">Extra Crispy</span>
               <span className="font-sans font-bold text-[9px] tracking-widest uppercase bg-[#F0EFFF] text-[#1D24C2] px-4 py-2 rounded-full shadow-sm border border-[#1D24C2]/20 text-center">No Preservative</span>
            </div>
          </div>

          {/* DESKTOP: absolute positioned layout */}
          <div className="berry-head hidden md:block absolute left-16 top-[25%] w-[40%] max-w-[400px] z-[20] pointer-events-none">
            <h2 className="font-sans font-black text-8xl tracking-tighter uppercase text-black drop-shadow-[5px_5px_0px_#E84E1B]">Berry</h2>
            <p className="font-sans text-xl text-gray-500 mt-2">(Bold. Real. Fizzy)</p>
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

        {/* ===== SECTION 4: CTA ===== */}
        <section id="section-cta" className="relative min-h-[80vh] md:h-screen flex flex-col items-center justify-end pb-12 md:pb-16 overflow-hidden">
          <div className="cta-content text-center z-[20] relative cursor-auto max-w-2xl px-6">
            <h3 className="font-sans font-bold text-[10px] md:text-xs tracking-widest text-gray-400 uppercase mb-3 md:mb-4">[ WHY DANG ]</h3>
            <p className="font-sans text-xl md:text-4xl text-black mb-8 md:mb-10 leading-tight">
              A pharmacist knew what the body needs. A chef knew what it wants.
            </p>
            <button 
              onClick={() => setIsFormOpen(true)}
              className="px-8 md:px-10 py-3 md:py-4 bg-black text-white rounded-full font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-gray-800 transition-all hover:scale-105"
            >
              Contact Us
            </button>
            <h3 className="font-sans font-bold text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase mt-6 md:mt-8">[ BEST SERVED COLD ]</h3>
          </div>
        </section>

      </div>

      {/* ===== CONTACT MODAL ===== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-md px-4 py-6 md:py-0 cursor-auto overflow-y-auto">
          <div className="bg-white p-6 md:p-12 rounded-2xl w-full max-w-md relative shadow-2xl border border-gray-100 my-auto">
            <button onClick={() => { setIsFormOpen(false); setSubmitStatus(""); }} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black transition-colors z-10">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <h2 className="text-xl md:text-2xl font-sans font-black mb-2 text-black">Drop a line.</h2>
            <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 font-sans">For the person who makes the smart choice.</p>
            
            <form className="flex flex-col gap-2.5 md:gap-3" onSubmit={handleSubmit}>
              <input type="text" name="name" required placeholder="Name" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
              <input type="email" name="email" required placeholder="Company Email" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
              <input type="tel" name="phone" required placeholder="Phone Number" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
              <textarea name="message" required placeholder="Message" rows={3} className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors resize-none" />
              <input type="hidden" name="subject" value="New Website Submission for Dang Soda" />
              <button type="submit" className="bg-black text-white font-sans font-medium text-xs tracking-widest uppercase py-3 md:py-4 rounded-lg mt-1 md:mt-2 hover:bg-gray-800 transition-colors">
                Send Message
              </button>
              {submitStatus && <div className={`mt-1 md:mt-2 font-sans font-medium text-center text-xs ${isError ? 'text-red-500' : 'text-green-600'}`}>{submitStatus}</div>}
            </form>

            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex flex-col gap-1.5 md:gap-2">
              <h3 className="font-sans font-bold text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase">Our Contacts</h3>
              <a href="mailto:humans@drinkdang.com" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 transition-colors">humans@drinkdang.com</a>
              <a href="tel:+919823482342" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 transition-colors">+91 9823482342</a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Index;