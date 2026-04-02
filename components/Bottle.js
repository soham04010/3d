"use client";
import React, { useRef, useLayoutEffect } from 'react';
import { useGLTF, Float, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Bottle(props) {
  const group = useRef();
  const innerGroup = useRef();
  
  // 1. Load the model and textures
  const { nodes, materials } = useGLTF('/bottle.glb');
  const yuzuTexture = useTexture('/yuzu.png');
  const berryTexture = useTexture('/berry.png');
  const berryRef = useRef();
  
  // 2. Set texture properties purely
  yuzuTexture.flipY = false;
  yuzuTexture.colorSpace = THREE.SRGBColorSpace; 
  berryTexture.flipY = false;
  berryTexture.colorSpace = THREE.SRGBColorSpace;

  // 3. GSAP Animation (Wrapped safely)
  useLayoutEffect(() => {
    if (!group.current) return;
    
    let ctx = gsap.context(() => {
      // Setup initial state
      gsap.set(group.current.rotation, { y: 0 });
      gsap.set(group.current.scale, { x: 8, y: 8, z: 8 }); // Fixed scale to match!
      gsap.set("#bg-layer", { backgroundColor: "#ffffff" });
      if (berryRef.current) gsap.set(berryRef.current, { opacity: 0 });

      // Animate into Details Section (Hero -> Yuzu)
      const tlDetails = gsap.timeline({
        scrollTrigger: { trigger: "#section-details", start: "top bottom", end: "bottom bottom", scrub: 1 },
      });
      // 1 full 360 spin
      tlDetails.to(group.current.rotation, { y: Math.PI * 2, ease: "power1.inOut" }, 0)
               // Background glitch to Yuzu
               .to("#bg-layer", { backgroundColor: "#ffea00", ease: "power1.inOut" }, 0);

      // Animate into Ingredients/Berry Section (Yuzu -> Berry)
      const tlIngredients = gsap.timeline({
        scrollTrigger: { trigger: "#section-ingredients", start: "top bottom", end: "bottom bottom", scrub: 1 },
      });
      // Another full 360 spin
      tlIngredients.to(group.current.rotation, { y: Math.PI * 4, ease: "power1.inOut" }, 0)
                   .to(group.current.scale, { x: 7.5, y: 7.5, z: 7.5, ease: "power1.inOut" }, 0)
                   .to("#bg-layer", { backgroundColor: "#ff2a70", ease: "power1.inOut" }, 0)
                   // The label "glitches" over to Berry during the spin!
                   .to(berryRef.current, {
                     keyframes: [
                       { opacity: 0, duration: 0.1 },
                       { opacity: 1, duration: 0.05 },
                       { opacity: 0, duration: 0.05 },
                       { opacity: 1, duration: 0.05 },
                       { opacity: 0.3, duration: 0.1 },
                       { opacity: 1, duration: 0.65 }
                     ],
                     ease: "none"
                   }, 0);

      // Animate into CTA Section
      const tlCta = gsap.timeline({
        scrollTrigger: { trigger: "#section-cta", start: "top bottom", end: "center center", scrub: 1 },
      });
      tlCta.to(group.current.rotation, { y: Math.PI * 6, ease: "power1.inOut" }, 0)
           .to(group.current.scale, { x: 9, y: 9, z: 9, ease: "power1.inOut" }, 0)
           .to("#bg-layer", { backgroundColor: "#00ffd5", ease: "power1.inOut" }, 0);
    });

    return () => ctx.revert();
  }, []);

  // 4. Slow Earth-like Continuous Tilted Rotation
  useFrame((state, delta) => {
    if (!innerGroup.current) return;
    
    // Earth's Axial Tilt: around 23.5 degrees (0.4 radians)
    innerGroup.current.rotation.x = 0.3; // Tilted towards the camera slightly
    innerGroup.current.rotation.z = 0.2; // Tilted sideways slightly
    
    // Rotate constantly and extremely slowly on its Y axis like the earth!
    innerGroup.current.rotation.y += delta * 0.2; 
    
    // Ensure translation stays completely locked dead center
    innerGroup.current.position.set(0, 0, 0);
  });

  return (
    <group ref={group} {...props} dispose={null} scale={8} position={[0, -0.45, 0]}>
      <group ref={innerGroup}>
        {/* Removed Float entirely so there is ZERO up-and-down bobbing levitation */}
        <mesh geometry={nodes.Tappo.geometry} material={materials.Mat} />
        
        {/* Primary Yuzu Label */}
        <mesh geometry={nodes.Etichetta.geometry} position={[0, 0.069, 0]} rotation={[Math.PI / 2, 0, -Math.PI]}>
          <meshStandardMaterial map={yuzuTexture} roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Glitched Berry Label (fractionally thicker to prevent z-fighting) */}
        <mesh geometry={nodes.Etichetta.geometry} position={[0, 0.069, 0]} rotation={[Math.PI / 2, 0, -Math.PI]} scale={[1.002, 1.002, 1.002]}>
          <meshStandardMaterial ref={berryRef} map={berryTexture} roughness={0.4} metalness={0.1} transparent={true} opacity={0} depthWrite={false} />
        </mesh>

        <mesh geometry={nodes.Bottiglia_1.geometry} material={materials.Mat} />
      </group>
    </group>
  );
}

useGLTF.preload('/bottle.glb');
useTexture.preload('/yuzu.png');