import Scene from "@/components/Scene";
import Link from "next/link";
import Image from "next/image";

// Static flavor data (Active Hop style)
const productData: Record<string, any> = {
  yuzu: {
    name: "YUZU CITRUS",
    tagline: "Bright. Crisp. Authentic.",
    description: "The kind of citrus that doesn't apologise for itself. Yuzu — native, sharp, clean. A soda you reach for at 6pm and don't think twice about.",
    price: "₹120.00",
    packSize: "6 x 250ml",
    nutritionLink: "#"
  },
  berry: {
    name: "BERRY BLAST",
    tagline: "Wild. Real. Fizzy.",
    description: "A burst of wild berries combined with the crispness of our signature soda. It's the bold, fruity hit you've been waiting for.",
    price: "₹120.00",
    packSize: "6 x 250ml",
    nutritionLink: "#"
  }
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const flavorId = resolvedParams.id.toLowerCase();
  const product = productData[flavorId] || productData.yuzu; 

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e0e3e1]">
      
      {/* BACKGROUND IMAGE / BLUR */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#e0e3e1]/40 backdrop-blur-3xl z-10"></div>
         <Image src="/hero.jpg" alt="Background" fill className="object-cover opacity-30" />
      </div>

      {/* 3D SCENE (FIXED IN BACKGROUND via its component) */}
      {/* Note: Scene already has z-index 50 and is fixed. We will layer our UI above it. */}
      <Scene flavor={flavorId} />

      {/* OVERLAY UI */}
      <div className="relative z-[60] w-full h-full pointer-events-none flex flex-col justify-between p-6 md:p-12">
          
          {/* TOP BAR / BREADCRUMBS */}
          <div className="flex justify-between items-start pt-16 md:pt-8 w-full pointer-events-auto">
             <div className="flex gap-2 text-xs md:text-xs font-sans font-bold uppercase tracking-widest text-black/80 bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Link href="/" className="hover:text-black transition-colors">HOME</Link>  
                <span>&gt;</span>
                <span className="text-black/50">PRODUCTS</span>
                <span>&gt;</span>
                <span className="text-black">{product.name}</span>
             </div>

             <div className="hidden md:block">
               <a href={product.nutritionLink} className="text-xs font-sans font-bold uppercase tracking-widest text-black/80 bg-white/30 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 hover:bg-white/50 transition-colors">
                 NUTRITION INFO
               </a>
             </div>
          </div>

          {/* BOTTOM RIGHT ADD TO CART CARD (Active Hop Style) */}
          <div className="self-end mt-auto pointer-events-auto max-w-sm w-full md:w-[380px] bg-white/40 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8 transition-transform hover:-translate-y-1 duration-300">
             
             <div className="flex justify-between items-end mb-4">
               <h1 className="font-sans font-black text-3xl uppercase tracking-tighter text-black m-0 leading-none">
                 {product.name}
               </h1>
               <div className="text-right">
                 <p className="text-xs font-bold text-black/60 m-0">{product.packSize}</p>
                 <p className="font-sans font-bold text-lg text-black m-0">{product.price}</p>
               </div>
             </div>

             <p className="font-serif italic text-sm text-black/80 mb-6 leading-relaxed">
               {product.description}
             </p>

             <button className="w-full bg-black text-white hover:bg-black/80 uppercase font-sans font-bold text-sm tracking-widest py-4 rounded-full transition-all duration-300 transform active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
               ADD TO CART
             </button>
          </div>
      </div>
    </div>
  );
}
