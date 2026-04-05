"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [activeLabel, setActiveLabel] = useState<"yuzu" | "berry" | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: "#section-details",
      start: "top 60%", end: "bottom 40%",
      onEnter: () => setActiveLabel("yuzu"),
      onLeaveBack: () => setActiveLabel(null),
    });

    ScrollTrigger.create({
      trigger: "#section-ingredients",
      start: "top 60%", end: "bottom 40%",
      onEnter: () => setActiveLabel("berry"),
      onLeaveBack: () => setActiveLabel("yuzu"),
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    // 1. Set Navbar to start exactly in the middle of the screen
    gsap.set(navRef.current, { top: "50vh", yPercent: -50 });
    
    // 2. Smooth fade in when site loads
    gsap.from(navRef.current, { opacity: 0, duration: 1.2, delay: 3.6, ease: "power3.out" });

    // 3. Glide to the top as the user starts scrolling
    gsap.to(navRef.current, {
      top: "18px",       // Docks at the top edge
      yPercent: 0,       // Resets the center transform
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "300px top", // Finishes gliding up after 300px of scroll
        scrub: 1,
      }
    });
  }, []);

  return (
    <nav ref={navRef} className="navbar-root">
      <div className={`navbar-pill ${scrolled ? "navbar-pill--scrolled" : ""}`}>

        {/* LEFT LINKS */}
        <div className="navbar-links">
          <a href="#section-whatis" className="navbar-link">About</a>
          <a href="#section-details" className="navbar-link">Product</a>
        </div>

        {/* CENTER LOGO */}
        <div className="navbar-logo">
          <Image
            src="/logo.png"
            alt="Dang Soda"
            width={160} 
            height={60} 
            style={{ objectFit: "contain", maxHeight: "40px" }}
            priority
          />
        </div>

        {/* RIGHT LINKS */}
        <div className="navbar-links">
          <a href="#section-cta" className="navbar-link">Merch</a>
          <a href="#section-cta" className="navbar-link">Contact&nbsp;Us</a>
        </div>
      </div>

      {/* FLAVOR LABEL PILL */}
      <div className={`flavor-label ${activeLabel === "yuzu" ? "flavor-label--yuzu flavor-label--visible" : activeLabel === "berry" ? "flavor-label--berry flavor-label--visible" : ""}`}>
        {activeLabel === "yuzu" && "✦ Yuzu Citrus"}
        {activeLabel === "berry" && "✦ Berry Blast"}
      </div>

      <style jsx>{`
        .navbar-root {
          position: fixed; left: 0; width: 100%; z-index: 200;
          display: flex; flex-direction: column; align-items: center; pointer-events: none;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        
        /* The floating pill */
        .navbar-pill {
          display: flex; align-items: center; justify-content: center;
          gap: 48px; /* Reduced spacing between logo and links */
          width: max-content; 
          max-width: 95vw;
          background: rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(20px) saturate(180%); border-radius: 999px;
          padding: 10px 40px; border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06); pointer-events: all;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        
        .navbar-pill--scrolled { background: rgba(255, 255, 255, 0.95); box-shadow: 0 8px 40px rgba(0, 0, 0, 0.10); }
        .navbar-links { display: flex; align-items: center; gap: 32px; }
        .navbar-link {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: #111111; text-decoration: none; cursor: pointer; position: relative;
          transition: color 0.2s ease; white-space: nowrap;
        }
        .navbar-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; width: 0%; height: 1px;
          background: #111111; transition: width 0.25s ease;
        }
        .navbar-link:hover { color: #000; }
        .navbar-link:hover::after { width: 100%; }
        .navbar-logo { display: flex; align-items: center; justify-content: center; }
        
        .flavor-label {
          margin-top: 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
          padding: 6px 18px; border-radius: 999px; opacity: 0; transform: translateY(-6px);
          transition: opacity 0.35s ease, transform 0.35s ease, background 0.35s ease, color 0.35s ease; pointer-events: none;
        }
        .flavor-label--visible { opacity: 1; transform: translateY(0); }
        .flavor-label--yuzu { background: #f0f5d6; color: #6a8920; border: 1px solid rgba(106, 137, 32, 0.25); }
        .flavor-label--berry { background: #fceef3; color: #c44d6d; border: 1px solid rgba(196, 77, 109, 0.25); }
        
        @media (max-width: 640px) {
          .navbar-pill { padding: 8px 24px; gap: 20px; }
          .navbar-links { gap: 16px; }
          .navbar-link { font-size: 9px; }
        }
      `}</style>
    </nav>
  );
}