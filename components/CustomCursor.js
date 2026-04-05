"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: "power3.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.6, duration: 0.15 });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, { scale: isHovering ? 2.5 : 1, duration: 0.2 });
    };

    const onMouseOver = (e) => {
      if (!e.target) return;
      
      const target = e.target;
      const isInteractive = target.closest('a') !== null || 
                            target.closest('button') !== null || 
                            target.tagName.toLowerCase() === 'input' ||
                            target.classList.contains('cursor-pointer');

      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursorRef.current, { scale: 2.5, opacity: 0.6, duration: 0.3 });
      } else {
        setIsHovering(false);
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
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
      className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      style={{ willChange: "transform" }}
    ></div>
  );
}
