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

    const handlePopState = () => {
      setTimeout(() => {
        if (window.location.pathname === "/") {
          window.location.reload();
        }
      }, 10);
    };
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      gsap.set(navRef.current, { top: "50vh", yPercent: -50 });
      gsap.from(navRef.current, { opacity: 0, duration: 1.2, delay: 3.6, ease: "power3.out" });
      gsap.to(navRef.current, {
        top: "18px",
        yPercent: 0,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "300px top",
          scrub: 1,
        }
      });
    } else {
      gsap.set(navRef.current, { top: "18px", yPercent: 0, opacity: 1 });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  // ✅ Pure native scroll — no plugin needed, always works
const handleAboutUsClick = (e: React.MouseEvent) => {
  e.preventDefault();
  // Target the text itself, not the top of the tall section
  const anchor = document.getElementById("about-anchor");
  if (anchor) {
    const y = anchor.getBoundingClientRect().top + window.scrollY - 100; // -100 for navbar headroom
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

  return (
    <>
    <nav ref={navRef} className="navbar-root">
      <div className={`navbar-pill ${scrolled ? "navbar-pill--scrolled" : ""}`}>
        <a href="#section-whatis" onClick={handleAboutUsClick} className="navbar-link">About Us</a>
        <button onClick={() => setOverlayType("product")} className="navbar-link bg-transparent border-none p-0 outline-none">Products</button>

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

        <button onClick={() => setOverlayType("merch")} className="navbar-link bg-transparent border-none p-0 outline-none">Merch</button>
        <a href="/contact" className="navbar-link">Contact Us</a>
      </div>

      <style jsx>{`
        .navbar-root {
          position: fixed; left: 0; width: 100%; z-index: 200;
          display: flex; flex-direction: column; align-items: center; pointer-events: none;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        .navbar-pill {
          display: flex; align-items: center; justify-content: center;
          gap: 40px;
          width: max-content;
          max-width: 95vw;
          background: #ffffff;
          border-radius: 999px;
          padding: 10px 48px; border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.06); pointer-events: all;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .navbar-pill--scrolled { background: #ffffff; box-shadow: 0 8px 40px rgba(0, 0, 0, 0.10); }
        .navbar-link {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: #111111; text-decoration: none; cursor: pointer; position: relative;
          transition: color 0.2s ease; white-space: nowrap;
        }
        .navbar-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0; width: 0%; height: 1px;
          background: #111111; transition: width 0.25s ease;
        }
        .navbar-link:hover, .navbar-link.cursor-colliding { color: #000; }
        .navbar-link:hover::after, .navbar-link.cursor-colliding::after { width: 100%; }
        .navbar-logo { display: flex; align-items: center; justify-content: center; }
        @media (max-width: 640px) {
          .navbar-pill { padding: 8px 24px; gap: 20px; }
          .navbar-links { gap: 16px; }
          .navbar-link { font-size: 9px; }
        }
      `}</style>
    </nav>
    <ExpandedOverlay
      isOpen={overlayType !== null}
      type={overlayType}
      onClose={() => setOverlayType(null)}
      onSwitchType={(t) => setOverlayType(t)}
    />
    </>
  );
}