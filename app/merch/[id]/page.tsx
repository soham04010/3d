import Link from "next/link";
import Image from "next/image";

// Static merch data (Active Hop style)
const merchData: Record<string, any> = {
  "tote-bag": {
    name: "DANG TOTE BAG",
    description: "Carry your everyday essentials in our heavy canvas tote. Minimal branding, maximum utility. Perfect for a quick grocery run or a day out in the city.",
    price: "₹899.00",
    image: "/Tote Bag.png",
    details: "100% Cotton Canvas • Heavyweight"
  },
  "tshirt": {
    name: "DANG SIGNATURE TEE",
    description: "The classic fit. Our signature t-shirt features a relaxed silhouette and ultra-soft combed cotton. Subtle back print detailing.",
    price: "₹1,499.00",
    image: "/tshirt.png",
    details: "100% French Terry Cotton • Relaxed Fit"
  },
  "cap": {
    name: "DANG DAD CAP",
    description: "An unstructured, low-profile dad cap for those sunny runs or bad hair days. Adjustable strap and subtle embroidered logo.",
    price: "₹799.00",
    image: "/cap Dang .png",
    details: "100% Cotton Twill • Adjustable Strap"
  }
};

export default async function MerchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const merchId = resolvedParams.id.toLowerCase();
  const product = merchData[merchId] || merchData["tshirt"]; 

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e0e3e1]">
      
      {/* BACKGROUND IMAGE / BLUR */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[#f4f4f4]/60 backdrop-blur-3xl z-10"></div>
         <img src="/hero.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      </div>

      {/* MERCH IMAGE (Pseudo-3D Float) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div style={{ animation: "float 6s ease-in-out infinite" }} className="relative drop-shadow-2xl">
           <Image 
             src={product.image} 
             alt={product.name} 
             width={600} 
             height={600} 
             className="w-auto max-h-[70vh] max-w-[80vw] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
             priority
           />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}} />

      {/* OVERLAY UI */}
      <div className="relative z-[60] w-full h-full pointer-events-none flex flex-col justify-between p-6 md:p-12">
          
          {/* TOP BAR / BREADCRUMBS */}
          <div className="flex justify-between items-start pt-16 md:pt-8 w-full pointer-events-auto">
             <div className="flex gap-2 text-xs md:text-xs font-sans font-bold uppercase tracking-widest text-black/80 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Link href="/" className="hover:text-black transition-colors">HOME</Link>  
                <span>&gt;</span>
                <span className="text-black/50">MERCH</span>
                <span>&gt;</span>
                <span className="text-black">{product.name}</span>
             </div>

             <div className="hidden md:block">
               <span className="text-xs font-sans font-bold uppercase tracking-widest text-black/60 px-4 py-2">
                 ALL SALES FINAL
               </span>
             </div>
          </div>

          {/* BOTTOM RIGHT ADD TO CART CARD (Active Hop Style) */}
          <div className="self-end mt-auto pointer-events-auto max-w-sm w-full md:w-[380px] bg-white/50 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden p-6 md:p-8 transition-transform hover:-translate-y-1 duration-300">
             
             <div className="flex justify-between items-end mb-4">
               <h1 className="font-sans font-black text-3xl uppercase tracking-tighter text-black m-0 leading-none mr-2">
                 {product.name}
               </h1>
               <div className="text-right whitespace-nowrap">
                 <p className="font-sans font-bold text-xl text-black m-0">{product.price}</p>
               </div>
             </div>

             <p className="text-xs font-bold text-black/50 uppercase tracking-widest mb-4">
               {product.details}
             </p>

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
