"use client";
import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Bottle(props) {
  const dropGroup = useRef(); 
  const group = useRef(); 
  const mouseGroup = useRef(); 
  const innerGroup = useRef(); 

  // We use an array to store ALL body materials so the glitch swap never fails
  const bodyMaterialRef = useRef([]);

  const { scene } = useGLTF('/bottle.glb');
  const yuzuTexture = useTexture('/yuzu.png');
  const berryTexture = useTexture('/berry.png');

  [yuzuTexture, berryTexture].forEach(t => {
    t.flipY = false;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(1, 1);
  });

  const canModel = useMemo(() => {
    const clone = scene.clone();
    bodyMaterialRef.current = []; // Reset the array

    clone.traverse((child) => {
      if (child.isMesh) {
        
        // Helper function to process individual materials safely
        const processMaterial = (mat) => {
          const name = mat.name.toLowerCase();
          
          // 1. Identify Top/Bottom Lids and Rims (Pure Silver)
          if (name.includes('metal-z') || name.includes('opener') || name.includes('top') || name.includes('bottom')) {
            return new THREE.MeshStandardMaterial({
              color: "#d0d0d0",
              roughness: 0.2,
              metalness: 0.9 // Shiny metallic
            });
          }

          // 2. Identify the Body (The Glossy Label)
          if (name.includes('metal-xy') || name.includes('body') || mat.map !== null || child.name === 'Object_5') {
            const bodyMat = new THREE.MeshStandardMaterial({
              map: yuzuTexture,
              color: "#ffffff",
              roughness: 0.25, // GLOSSY FINISH (low roughness)
              metalness: 0.8   // Very low metalness so colors stay bright
            });
            bodyMaterialRef.current.push(bodyMat); // Save for glitch swap
            return bodyMat;
          }

          // Fallback for any other weird parts
          return new THREE.MeshStandardMaterial({
            color: "#d0d0d0",
            roughness: 0.2,
            metalness: 0.9
          });
        };

        // Apply material safely whether it's a single material or an array of materials
        if (Array.isArray(child.material)) {
          child.material = child.material.map(processMaterial);
        } else {
          child.material = processMaterial(child.material);
        }

        // Auto-fix rotation if the artist exported it laying flat
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox;
        if (box) {
          const size = new THREE.Vector3();
          box.getSize(size);
          if (size.x > size.y * 1.5) {
             child.rotation.z = Math.PI / 2;
          }
        }
      }
    });

    return clone;
  }, [scene, yuzuTexture, berryTexture]);

  useLayoutEffect(() => {
    if (!group.current || !dropGroup.current) return;

    let ctx = gsap.context(() => {
      // ===== NEW SOOTHING ENTRANCE ANIMATION =====
      // Replaced the fast bounce with a slow, premium float-up and gentle spin
      gsap.from(dropGroup.current.position, {
        y: -1.5, // Starts slightly lower
        duration: 3.5, // Much slower so the user has time to watch it
        delay: 3.4, 
        ease: "power3.out" // Silky smooth deceleration
      });
      gsap.from(dropGroup.current.rotation, {
        y: -Math.PI / 1.5, // Adds a slow, elegant quarter-turn spin into place
        x: 0.15, // Subtle backward tilt
        duration: 3.5, 
        delay: 3.4, 
        ease: "power3.out" 
      });
      gsap.from(dropGroup.current.scale, {
        x: 0.8, y: 0.8, z: 0.8, // Slightly scales up as it floats
        duration: 3.5, 
        delay: 3.4, 
        ease: "power3.out" 
      });
      // =============================================

      gsap.set(group.current.rotation, { y: 0 });
      gsap.set(group.current.position, { y: 0 }); 

      // WHAT IS DANG
      const tlWhatIs = gsap.timeline({ scrollTrigger: { trigger: "#section-whatis", start: "top bottom", end: "center center", scrub: 1 } });
      tlWhatIs.to(group.current.rotation, { y: 0, ease: "none" }, 0)
              .to("#bg-layer", { backgroundColor: "#fafafa", ease: "none" }, 0); 

      // YUZU ROTATION
      const tlDetails = gsap.timeline({ scrollTrigger: { trigger: "#section-details", start: "top bottom", end: "center center", scrub: 1 } });
      tlDetails.to(group.current.rotation, { y: Math.PI * 2, ease: "power1.inOut" }, 0)
               .to("#bg-layer", { backgroundColor: "#f9fcf5", ease: "power1.inOut" }, 0);

      // BERRY ROTATION
      const tlIngredients = gsap.timeline({ scrollTrigger: { trigger: "#section-ingredients", start: "top bottom", end: "center center", scrub: 1 } });
      tlIngredients.to(group.current.rotation, { y: Math.PI * 4, ease: "power1.inOut" }, 0)
                   .to("#bg-layer", { backgroundColor: "#fcf5f7", ease: "power1.inOut" }, 0);

      // INSTANT GLITCH TEXTURE SWAP
      ScrollTrigger.create({
        trigger: "#section-ingredients",
        start: "top 60%", 
        onEnter: () => {
          // Helper function to swap textures on ALL body meshes instantly
          const setTex = (tex) => {
            bodyMaterialRef.current.forEach(mat => {
              mat.map = tex;
              mat.needsUpdate = true;
            });
          };
          
          setTimeout(() => setTex(berryTexture), 0);
          setTimeout(() => setTex(yuzuTexture), 50);
          setTimeout(() => setTex(berryTexture), 100);
          setTimeout(() => setTex(yuzuTexture), 150);
          setTimeout(() => setTex(berryTexture), 200); // Settles on Berry
        },
        onLeaveBack: () => {
          const setTex = (tex) => {
            bodyMaterialRef.current.forEach(mat => {
              mat.map = tex;
              mat.needsUpdate = true;
            });
          };
          
          setTimeout(() => setTex(yuzuTexture), 0);
          setTimeout(() => setTex(berryTexture), 50);
          setTimeout(() => setTex(yuzuTexture), 100); // Settles back on Yuzu
        }
      });

      // CTA
      const tlCta = gsap.timeline({ scrollTrigger: { trigger: "#section-cta", start: "top bottom", end: "center center", scrub: 1 } });
      tlCta.to(group.current.rotation, { y: Math.PI * 6 }, 0)
           .to("#bg-layer", { backgroundColor: "#ffffff" }, 0);
    });

    return () => ctx.revert();
  }, [yuzuTexture, berryTexture]); 

  useFrame((state, delta) => {
    if (innerGroup.current) innerGroup.current.rotation.y += delta * 0.3;
    if (mouseGroup.current) {
      mouseGroup.current.rotation.y = THREE.MathUtils.lerp(mouseGroup.current.rotation.y, (state.pointer.x * Math.PI) / 10, 0.05);
      mouseGroup.current.rotation.x = THREE.MathUtils.lerp(mouseGroup.current.rotation.x, -(state.pointer.y * Math.PI) / 10, 0.05);
    }
  });

  return (
    <group ref={dropGroup}>
      <group ref={group} {...props}>
        <group ref={mouseGroup}>
          <group ref={innerGroup}>
            
            <ambientLight intensity={1.5} /> 
            <spotLight position={[0, 5, 8]} angle={0.4} penumbra={0.8} intensity={20} color="#ffffff" />
            <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={0.5} intensity={15} color="#ffffff" />
            <directionalLight position={[2, 0, 5]} intensity={1.5} color="#ffffff" />

            <group scale={15} position={[0, -1.2, 0]}>
              <primitive object={canModel} />
            </group>
            
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/bottle.glb');
useTexture.preload('/yuzu.png');
useTexture.preload('/berry.png');