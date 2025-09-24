import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { FluidWave, FluidWaveLayer } from './FluidWave';

const WAVE_SCROLL_SPEED = 0.4;
const WAVE_COLOR_SCROLL_SPEED = 0.12;

// Responsive Camera Controller
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (size.width < 768) {
      camera.position.set(0, 0, 15);
    } else if (size.width < 1024) {
      camera.position.set(0, 0, 12);
    } else {
      camera.position.set(0, 0, 10);
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// Main 3D Scene Component
export function ThreeDScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          color="#ffffff"
        />
        <pointLight 
          position={[-10, -10, 5]} 
          intensity={0.4} 
          color="#8b5cf6"
        />

        {/* 3D Elements */}
        <FluidWave
          scrollSpeed={WAVE_SCROLL_SPEED}
          colorScrollSpeed={WAVE_COLOR_SCROLL_SPEED}
          animated={true}
        />
        <FluidWaveLayer
          scrollSpeed={WAVE_SCROLL_SPEED}
          colorScrollSpeed={WAVE_COLOR_SCROLL_SPEED}
          animated={true}
        />

        {/* Responsive Camera */}
        <ResponsiveCamera />
      </Canvas>
    </div>
  );
}