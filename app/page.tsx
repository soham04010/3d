"use client";
import dynamic from "next/dynamic";
import CustomCursor from "@/components/CustomCursor";

const Scene = dynamic(() => import("@/components/Scene"), { 
  ssr: false,
});

export default function Home() {
  return (
    <>
      <CustomCursor />
      {/* CRITICAL FIX: Background Color Layer is fixed behind the Canvas */}
      <div id="bg-layer" className="fixed top-0 left-0 w-screen h-screen -z-20 bg-[#fff5ea] transition-all" />

      {/* CRITICAL FIX: Scene is now OUTSIDE the main scrolling tag. 
        It will stay permanently fixed to the window.
      */}
      <Scene />
      
      <main className="main-container relative w-full overflow-x-hidden bg-transparent">
        
        {/* Page 1 - Hero */}
        <section id="section-hero" className="relative z-10 h-screen flex flex-col items-center justify-start pointer-events-none overflow-hidden">
          {/* Background Hero Image */}
          <div className="absolute top-0 left-0 w-full h-screen -z-20 opacity-40 mix-blend-multiply pointer-events-none">
             <img src="/hero.jpg" alt="Hero Background" className="w-full h-full object-cover" />
          </div>

          {/* Extreme Kinetic Marquee Background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400%] flex whitespace-nowrap opacity-20 -z-10 animate-marquee select-none mix-blend-color-burn">
            <h1 className="text-[30vw] font-syne font-black uppercase tracking-tighter text-outline px-10">
              DANG SODA DANG SODA DANG SODA DANG SODA
            </h1>
          </div>
          
          <div className="absolute left-10 md:left-20 bottom-[30vh] w-[80%] md:w-1/3 z-10">
             <h1 className="text-7xl md:text-[8vw] font-syne font-black uppercase tracking-tighter text-[#ff5e00] mix-blend-difference leading-none drop-shadow-2xl">
               DANG <br />SODA
             </h1>
             <p className="text-xl md:text-2xl font-bold tracking-tight mt-6 text-black uppercase bg-[#ff5e00] px-6 py-3 rounded-xl border-4 border-black inline-block shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                Gen-Z Desi Tropics Fix ™
             </p>
          </div>
        </section>

        {/* Page 2 - Product Info / Flavor Details */}
        <section id="section-details" className="relative z-10 h-[200vh] flex flex-col justify-start pointer-events-none overflow-hidden">
          {/* We use sticky to keep the text grouped while we scroll through this tall section */}
          <div className="sticky top-0 h-screen flex items-center justify-between px-10 md:px-20 w-full overflow-hidden">
            {/* Background Marquee specific to this section */}
            <div className="absolute top-[20%] left-0 w-[400%] flex whitespace-nowrap opacity-10 -z-10 animate-[marquee_15s_linear_infinite_reverse] select-none pointer-events-none">
              <h1 className="text-[20vw] font-syne font-black uppercase tracking-tighter text-black px-10">
                 YUZU CITRUS YUZU CITRUS YUZU CITRUS
              </h1>
            </div>

            <div className="w-1/3">
              <h2 className="text-6xl md:text-9xl font-syne font-black italic text-[#ff0055] uppercase tracking-tighter mix-blend-difference drop-shadow-xl">YUZU</h2>
              <div className="mt-8 space-y-6">
                <p className="text-xl md:text-3xl font-syne uppercase text-black font-black whitespace-nowrap border-b-4 border-black inline-block">Zero Sugar</p>
                <div className="h-0.5 w-full bg-transparent" />
                <p className="text-xl md:text-3xl font-syne uppercase text-black font-black whitespace-nowrap border-b-4 border-black inline-block">No BS</p>
              </div>
            </div>
            
            <div className="w-1/3 text-right">
              <h2 className="text-7xl md:text-9xl font-syne font-black italic text-black/90 uppercase tracking-tighter opacity-10 text-outline mix-blend-multiply flex flex-col gap-2">
                <span>SOUR</span>
                <span>SWEET</span>
                <span>TANGY</span>
              </h2>
            </div>
          </div>
        </section>

        {/* Page 3 - Ingredients / Additional Info */}
        <section id="section-ingredients" className="relative z-10 h-[150vh] flex flex-col pointer-events-none overflow-hidden">
             <div className="sticky top-0 h-screen w-full">
                <h2 className="absolute top-10 left-10 md:left-20 text-6xl md:text-[8vw] font-syne font-black italic text-black uppercase tracking-tighter mix-blend-overlay">REFRESHING</h2>
                
                <div className="absolute bottom-[20vh] left-0 w-full px-10 md:px-20 flex justify-between items-end">
                    <div className="bg-white/30 backdrop-blur-md p-8 md:p-14 rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-[-6deg] hover:rotate-0 transition-transform origin-bottom-left w-[45%] md:w-1/3">
                        <h3 className="text-4xl md:text-7xl font-syne font-black mb-2 text-[#00ffcc] text-outline stroke-2 mix-blend-exclusion">100%</h3>
                        <p className="text-xl md:text-3xl font-black text-black">DESI VIBES</p>
                    </div>
                    <div className="bg-white/30 backdrop-blur-md p-8 md:p-14 rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] rotate-[6deg] hover:rotate-0 transition-transform origin-bottom-right w-[45%] md:w-1/3 text-right">
                        <h3 className="text-4xl md:text-7xl font-syne font-black mb-2 text-[#ff00cc] text-outline mix-blend-exclusion">REAL</h3>
                        <p className="text-xl md:text-3xl font-black text-black">FRUIT JUICE</p>
                    </div>
                </div>
             </div>
        </section>

        {/* Page 4 - CTA */}
        <section id="section-cta" className="relative z-10 h-screen flex flex-col justify-end pointer-events-auto pb-[15vh]">
          <div className="flex justify-center w-full relative z-30">
            <button className="bg-[#ff5e00] text-black border-8 border-black px-20 py-8 rounded-full font-syne font-black text-5xl md:text-7xl hover:scale-[1.05] active:scale-95 transition-transform shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#00ffcc]">
              GRAB A CAN
            </button>
          </div>
        </section>

      </main>
    </>
  );
}