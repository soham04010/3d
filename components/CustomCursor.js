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

    let isHovering = false;
    let currentHoverTarget = null;

    const checkCollision = (clientX, clientY) => {
      // Create a 100x100 hitbox around the current mouse point (radius 50px)
      const cursorRect = { 
        left: clientX - 50, 
        right: clientX + 50, 
        top: clientY - 50, 
        bottom: clientY + 50 
      };
      
      const interactives = Array.from(document.querySelectorAll('a, button, input, textarea, .cursor-pointer'));
      
      for (const el of interactives) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        
        // 2D true collision check
        if (!(cursorRect.right < rect.left || 
              cursorRect.left > rect.right || 
              cursorRect.bottom < rect.top || 
              cursorRect.top > rect.bottom)) {
          return el; // Return the first element the graphic is visibly touching
        }
      }
      return null;
    };

    let lastMousePos = { x: -1000, y: -1000 };

    const updateHoverState = (target) => {
      if (target !== currentHoverTarget) {
        if (currentHoverTarget) {
          currentHoverTarget.classList.remove('cursor-colliding');
        }
        currentHoverTarget = target;
        if (currentHoverTarget) {
          currentHoverTarget.classList.add('cursor-colliding');
        }
        
        const shouldHover = !!target;
        if (shouldHover !== isHovering) {
          isHovering = shouldHover;
          gsap.to(cursorRef.current, { scale: isHovering ? 1.3 : 1, duration: 0.25 });
        }
      }
    };

    const onMouseMove = (e) => {
      lastMousePos.x = e.clientX;
      lastMousePos.y = e.clientY;
      
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power3.out",
      });

      const target = checkCollision(e.clientX, e.clientY);
      updateHoverState(target);
    };

    const onScroll = () => {
      // Re-check collision because elements moved underneath the stationary mouse
      if (lastMousePos.x !== -1000) {
        const target = checkCollision(lastMousePos.x, lastMousePos.y);
        updateHoverState(target);
      }
    };

    const onMouseDown = () => {
      gsap.to(cursorRef.current, { scale: 0.7, duration: 0.12 });
    };

    const onMouseUp = () => {
      gsap.to(cursorRef.current, { scale: isHovering ? 1.3 : 1, duration: 0.15 });
    };

    const onClick = (e) => {
      // Re-verify exact target at the moment of click
      const activeTarget = checkCollision(e.clientX, e.clientY);

      // FAT CURSOR OVERRIDE
      if (activeTarget && !activeTarget.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
        
        // Push the click manually to the next macro-task so it doesn't get
        // swallowed by React's synthetic event capture phase
        setTimeout(() => {
          activeTarget.click();
        }, 0);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("click", onClick, true); // capture phase to override default completely

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("click", onClick, true);
    };
  }, []);

  // Don't render the cursor on touch devices
  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        width: '70px',
        height: '80px',
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
