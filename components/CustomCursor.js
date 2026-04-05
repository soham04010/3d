"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices — hide custom cursor entirely
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    setIsTouchDevice(hasTouch);
    if (hasTouch) return;

    const onMouseMove = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power3.out",
      });
    };

    const onMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.7, duration: 0.12 });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, { scale: isHovering ? 1.3 : 1, duration: 0.15 });
    };

    const onMouseOver = (e) => {
      if (!e.target) return;
      
      const target = e.target;
      const isInteractive = target.closest('a') !== null || 
                            target.closest('button') !== null || 
                            target.tagName.toLowerCase() === 'input' ||
                            target.tagName.toLowerCase() === 'textarea' ||
                            target.classList.contains('cursor-pointer');

      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursorRef.current, { scale: 1.3, duration: 0.25 });
      } else {
        setIsHovering(false);
        gsap.to(cursorRef.current, { scale: 1, duration: 0.25 });
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

  // Don't render the cursor on touch devices
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: '100px',
        height: '100px',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
      }}
    >
      <img
        src="/arrow-icon.2.png"
        alt=""
        draggable={false}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
