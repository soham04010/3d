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
  const berryRef = useRef();

  const { scene } = useGLTF('/bottle.glb');
  const yuzuTexture = useTexture('/yuzu.png');
  const berryTexture = useTexture('/berry.png');

  yuzuTexture.flipY = false;
  yuzuTexture.colorSpace = THREE.SRGBColorSpace;
  berryTexture.flipY = false;
  berryTexture.colorSpace = THREE.SRGBColorSpace;

  // ===== AUTO-DETECT & PRESERVE HIERARCHY =====
  // This safely clones the client's file so it never crashes, no matter what they name the parts inside!
  const canModel = useMemo(() => {
    const clone = scene.clone();
    let maxVerts = 0;
    let mainBody = null;

    clone.traverse((child) => {
      if (child.isMesh) {
        const verts = child.geometry?.attributes?.position?.count || 0;
        if (verts > maxVerts) {
          maxVerts = verts;
          mainBody = child;
        }
      }
    });

    clone.traverse((child) => {
      if (child.isMesh) {
        if (child === mainBody) {
          child.material = new THREE.MeshStandardMaterial({ map: yuzuTexture, roughness: 0.15, metalness: 0.3 });
          
          const berryMesh = new THREE.Mesh(
            child.geometry,
            new THREE.MeshStandardMaterial({ map: berryTexture, roughness: 0.15, metalness: 0.3, transparent: true, opacity: 0, depthWrite: false })
          );
          berryMesh.scale.set(1.001, 1.001, 1.001);
          berryRef.current = berryMesh.material;
          child.add(berryMesh);
        } else {
          child.material = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.05, metalness: 0.8 });
        }
      }
    });
    return clone;
  }, [scene, yuzuTexture, berryTexture]);

  useLayoutEffect(() => {
    if (!group.current || !dropGroup.current) return;

    let ctx = gsap.context(() => {
      // ===== THE DROP ANIMATION =====
      gsap.from(dropGroup.current.position, {
        y: 8, 
        duration: 1.8,
        delay: 3.4, 
        ease: "bounce.out" 
      });

      // ===== SCROLL ANIMATIONS =====
      gsap.set(group.current.rotation, { y: 0 });
      gsap.set(group.current.scale, { x: 1, y: 1, z: 1 }); 
      gsap.set(group.current.position, { y: 0 }); 
      gsap.set("#bg-layer", { backgroundColor: "#ffffff" }); 

      if (berryRef.current) gsap.set(berryRef.current, { opacity: 0 });

      // WHAT IS DANG 
      const tlWhatIs = gsap.timeline({
        scrollTrigger: { trigger: "#section-whatis", start: "top bottom", end: "center center", scrub: 1 },
      });
      tlWhatIs.to(group.current.rotation, { y: 0, ease: "none" }, 0)
              .to("#bg-layer", { backgroundColor: "#fafafa", ease: "none" }, 0); 

      // YUZU 
      const tlDetails = gsap.timeline({
        scrollTrigger: { trigger: "#section-details", start: "top bottom", end: "center center", scrub: 1 },
      });
      tlDetails.to(group.current.rotation, { y: Math.PI * 2, ease: "power1.inOut" }, 0)
               .to("#bg-layer", { backgroundColor: "#f9fcf5", ease: "power1.inOut" }, 0);

      // BERRY 
      const tlIngredients = gsap.timeline({
        scrollTrigger: { trigger: "#section-ingredients", start: "top bottom", end: "center center", scrub: 1 },
      });
      tlIngredients.to(group.current.rotation, { y: Math.PI * 4, ease: "power1.inOut" }, 0)
                   .to(group.current.scale, { x: 0.95, y: 0.95, z: 0.95, ease: "power1.inOut" }, 0)
                   .to("#bg-layer", { backgroundColor: "#fcf5f7", ease: "power1.inOut" }, 0);

      if (berryRef.current) {
        tlIngredients.to(berryRef.current, {
          keyframes: [
            { opacity: 0, duration: 0.1 }, { opacity: 1, duration: 0.05 }, { opacity: 0, duration: 0.05 },
            { opacity: 1, duration: 0.05 }, { opacity: 0.3, duration: 0.1 }, { opacity: 1, duration: 0.65 }
          ],
          ease: "none"
        }, 0);
      }

      // CTA 
      const tlCta = gsap.timeline({
        scrollTrigger: { trigger: "#section-cta", start: "top bottom", end: "center center", scrub: 1 },
      });
      tlCta.to(group.current.rotation, { y: Math.PI * 6, ease: "power1.inOut" }, 0)
           .to(group.current.scale, { x: 1.05, y: 1.05, z: 1.05, ease: "power1.inOut" }, 0)
           .to(group.current.position, { y: 1.2, ease: "power1.inOut" }, 0)
           .to("#bg-layer", { backgroundColor: "#ffffff", ease: "power1.inOut" }, 0);
    });

    return () => ctx.revert();
  }, []);

  useFrame((state, delta) => {
    if (innerGroup.current) {
      innerGroup.current.rotation.x = 0.3; 
      innerGroup.current.rotation.z = 0.2; 
      innerGroup.current.rotation.y += delta * 0.2; 
    }
    if (mouseGroup.current) {
      const targetX = (state.pointer.x * Math.PI) / 10; 
      const targetY = (state.pointer.y * Math.PI) / 10;
      mouseGroup.current.rotation.y = THREE.MathUtils.lerp(mouseGroup.current.rotation.y, targetX, 0.05);
      mouseGroup.current.rotation.x = THREE.MathUtils.lerp(mouseGroup.current.rotation.x, -targetY, 0.05);
    }
  });

  return (
    <group ref={dropGroup}>
      <group ref={group} {...props} dispose={null} scale={1} position={[0, 0, 0]}>
        <group ref={mouseGroup}>
          <group ref={innerGroup}>
            <ambientLight intensity={1.5} /> 
            <spotLight position={[0, 5, 8]} angle={0.4} penumbra={0.8} intensity={20} color="#ffffff" />
            <spotLight position={[-5, 5, -5]} angle={0.5} penumbra={0.5} intensity={15} color="#ffffff" />
            <directionalLight position={[2, 0, 5]} intensity={1.5} color="#ffffff" />

            {/* THE FIX: MASSIVELY SCALED UP! */}
            {/* If it is still too small, change scale={25} to scale={40}. If too big, try scale={10} */}
            <group scale={15} position={[0, -1.5, 0]}>
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