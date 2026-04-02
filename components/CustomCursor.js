"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, { scale: isHovering ? 1.5 : 1, duration: 0.2 });
    };

    const onMouseOver = (e) => {
      if (e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a') {
        setIsHovering(true);
        gsap.to(cursorRef.current, { scale: 1.5, backgroundColor: "#000", duration: 0.3 });
        if (textRef.current) textRef.current.innerText = "CLICK!";
      } else {
        setIsHovering(false);
        gsap.to(cursorRef.current, { scale: 1, backgroundColor: "#ff5e00", duration: 0.3 });
        if (textRef.current) textRef.current.innerText = "THIRSTY?";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isHovering]);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-24 h-24 rounded-full bg-[#ff5e00] pointer-events-none z-[100] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference overflow-hidden"
    >
      <span ref={textRef} className="text-white font-syne font-bold text-xs uppercase tracking-widest text-center">
        THIRSTY?
      </span>
    </div>
  );
}
