import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const BRAND = {
  rustyOrange: "#D13A1A",
  brightYellow: "#F5C800",
  green:        "#08A045",
  blue:         "#7E14BB",
  violet:       "#6804FF",
  font:         "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

interface ExpandedOverlayProps {
  isOpen: boolean;
  type: "product" | "merch" | null;
  onClose: () => void;
  // ✅ Allow parent to switch between product/merch without closing
  onSwitchType?: (type: "product" | "merch") => void;
}

export default function ExpandedOverlay({ isOpen, type, onClose, onSwitchType }: ExpandedOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(
        ".overlay-content",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    } else {
      document.body.style.overflow = "auto";
      gsap.to(".overlay-content", {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => setShouldRender(false),
      });
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const products = [
    {
      id: "yuzu",
      title: "Refreshing. Genuine. Pure.",
      buttonText: "DISCOVER YUZU",
      image: "/yuzu_pro.png",
      btnBg: BRAND.brightYellow,
      btnColor: "#000000",
      link: "/product/yuzu",
    },
    {
      id: "berry",
      title: "Wild. Real. Fizzy.",
      buttonText: "DISCOVER BERRY",
      image: "/berry_pro.png",
      btnBg: BRAND.rustyOrange,
      btnColor: "#ffffff",
      link: "/product/berry",
    },
  ];

  const merch = [
    {
      id: "tshirt",
      title: "Dang Signature Tee.",
      buttonText: "DISCOVER TEE",
      image: "/tshirt A.png",
      btnBg: "#ffffff",
      btnColor: "#000000",
      link: "/merch/tshirt",
    },
    {
      id: "tote-bag",
      title: "Heavyweight Cotton Canvas.",
      buttonText: "DISCOVER TOTE",
      image: "/Tote Bag.png",
      btnBg: BRAND.violet,
      btnColor: "#ffffff",
      link: "/merch/tote-bag",
    },
    {
      id: "cap",
      title: "Low-profile Dad Cap.",
      buttonText: "DISCOVER CAP",
      image: "/cap Dang .png",
      btnBg: "#000000",
      btnColor: "#ffffff",
      link: "/merch/cap",
    },
  ];

  const items = type === "product" ? products : merch;

  return (
    <div
      className="fixed inset-0 z-[250] flex flex-col items-center justify-center p-3 md:p-6"
      style={{ fontFamily: BRAND.font }}
      onClick={onClose}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[35px] transition-opacity duration-500" />

      {/* Main glass panel */}
      <div
        className="overlay-content relative z-10 w-full max-w-6xl max-h-[92vh] md:h-[85vh] bg-white/70 backdrop-blur-2xl border border-white/50 rounded-[24px] md:rounded-[40px] shadow-2xl p-4 md:p-8 flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ✅ Header — shows the OPPOSITE nav item + About Us, both clickable */}
        <div className="flex justify-between items-center mb-6 md:mb-10 px-1 md:px-4">
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest text-black/80" style={{ fontWeight: 700 }}>

            {/* ✅ If Products is open → show MERCH link; if Merch is open → show PRODUCTS link */}
            {type === "product" ? (
              <span
                className="cursor-pointer hover:opacity-60 transition-opacity"
                onClick={() => onSwitchType?.("merch")}
              >
                MERCH
              </span>
            ) : (
              <span
                className="cursor-pointer hover:opacity-60 transition-opacity"
                onClick={() => onSwitchType?.("product")}
              >
                PRODUCTS
              </span>
            )}

            {/* ✅ About Us — closes overlay and scrolls to section */}
            <span
              className="cursor-pointer hover:opacity-60 transition-opacity"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const anchor = document.getElementById("about-anchor");
                  if (anchor) {
                    const y = anchor.getBoundingClientRect().top + window.scrollY - 100;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }
                }, 350); // wait for overlay close animation
              }}
            >
              ABOUT US
            </span>
          </div>

          {/* Logo — goes home */}
          <Link href="/" className="md:absolute md:left-1/2 md:-translate-x-1/2 cursor-pointer" onClick={onClose}>
            <Image
              src="/logo.png"
              alt="Dang Soda"
              width={110}
              height={40}
              style={{ objectFit: "contain", maxHeight: "30px" }}
            />
          </Link>

          {/* Close */}
          <div
            className="text-[10px] md:text-xs uppercase tracking-widest text-black/80 cursor-pointer pointer-events-auto relative z-50 hover:opacity-60 transition-opacity px-2 py-1 rounded"
            style={{ fontWeight: 700 }}
            onClick={onClose}
          >
            CLOSE ✕
          </div>
        </div>

        {/* Grid */}
        <div
          className={`grid gap-4 md:gap-6 flex-grow min-h-0 ${
            type === "product"
              ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto w-full"
              : "grid-cols-1 md:grid-cols-3 w-full"
          }`}
        >
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col w-full">
              {/* Image area */}
              <div className="flex-grow bg-white/40 rounded-t-2xl relative overflow-hidden flex items-center justify-center min-h-[35vh] md:min-h-[50vh]">
                <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#000_2px,#000_4px)] pointer-events-none" />
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.buttonText}
                    fill
                    className="object-contain p-6 md:p-8 z-10 hover:scale-105 transition-transform duration-500 will-change-transform"
                  />
                )}
              </div>

              {/* Card footer */}
              <div className="bg-white/60 backdrop-blur-xl p-4 md:p-6 rounded-b-2xl border-t border-white/40">
                <p className="text-xs md:text-sm text-black mb-4 md:mb-6 w-full" style={{ fontWeight: 500 }}>
                  {item.title}
                </p>
                <Link href={item.link} onClick={onClose} className="block w-full">
                  <button
                    className="w-full py-2.5 md:py-3 rounded-full text-[9px] sm:text-xs tracking-widest uppercase transition-transform hover:scale-[1.02] active:scale-95 shadow-lg pointer-events-auto cursor-pointer"
                    style={{
                      fontFamily: BRAND.font,
                      fontWeight: 700,
                      backgroundColor: item.btnBg,
                      color: item.btnColor,
                      boxShadow: item.btnBg === "#ffffff"
                        ? "0 0 0 1.5px rgba(0,0,0,0.12), 0 4px 14px rgba(0,0,0,0.06)"
                        : undefined,
                    }}
                  >
                    {item.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}