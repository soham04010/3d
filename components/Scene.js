"use client";
import { Suspense, useEffect, useState } from "react"; 
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import Bottle from "./Bottle";

export default function Scene() {
  // This state prevents the Canvas from rendering until the browser is 100% ready
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Cleanup function to help prevent WebGL context loss on unmount
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 50, pointerEvents: 'none' }}>
      {/* We add preserveDrawingBuffer to help stabilize the WebGL context */}
      <Canvas camera={{ position: [0, 0, 5], fov: 35 }} gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        
        <Suspense fallback={null}>
          <Bottle />
        </Suspense>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2} far={4.5} />
        <Environment preset="city" /> 
      </Canvas>
    </div>
  );
}