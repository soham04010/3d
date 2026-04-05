"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ExpandedOverlay from "./ExpandedOverlay";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const [overlayType, setOverlayType] = useState<"product" | "merch" | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  useEffect(() => {
    if (pathname === "/") {
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
    } else {
      // On other pages (Product, Merch), just dock it to the top immediately.
      gsap.set(navRef.current, { top: "18px", yPercent: 0, opacity: 1 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  return (
    <>
    <nav ref={navRef} className="navbar-root">
      <div className={`navbar-pill ${scrolled ? "navbar-pill--scrolled" : ""}`}>

        {/* LEFT LINKS */}
        <div className="navbar-links">
          <a href="/#section-whatis" className="navbar-link">About</a>
          <button onClick={() => setOverlayType("product")} className="navbar-link bg-transparent border-none p-0 outline-none">Product</button>
        </div>

        {/* CENTER LOGO */}
        <Link href="/" className="navbar-logo">
          <Image
            src="/logo.png"
            alt="Dang Soda"
            width={160} 
            height={60} 
            style={{ objectFit: "contain", maxHeight: "40px" }}
            priority
          />
        </Link>

        {/* RIGHT LINKS */}
        <div className="navbar-links">
          <button onClick={() => setOverlayType("merch")} className="navbar-link bg-transparent border-none p-0 outline-none">Merch</button>
          <a href="/#section-cta" className="navbar-link">Contact&nbsp;Us</a>
        </div>
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
          background: #ffffff; /* Solid white background */
          border-radius: 999px;
          padding: 10px 40px; border: 1px solid rgba(0, 0, 0, 0.08); /* Keeps pill outline subtle */
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06); pointer-events: all;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        
        .navbar-pill--scrolled { background: #ffffff; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.10); }
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
        
        @media (max-width: 640px) {
          .navbar-pill { padding: 8px 24px; gap: 20px; }
          .navbar-links { gap: 16px; }
          .navbar-link { font-size: 9px; }
        }
      `}</style>
    </nav>
    <ExpandedOverlay isOpen={overlayType !== null} type={overlayType} onClose={() => setOverlayType(null)} />
    </>
  );
}