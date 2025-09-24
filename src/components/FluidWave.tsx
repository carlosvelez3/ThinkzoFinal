import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type FluidWaveProps = {
  scrollSpeed?: number;
  colorScrollSpeed?: number;
  waveStrength?: number;
  frequency?: number;
  secondaryFrequency?: number;
  staticYScale?: number;
  animated?: boolean;
};

export function FluidWave({
  scrollSpeed = 0.4,
  colorScrollSpeed = 0.12,
  waveStrength = 2.0,
  frequency = 0.4,
  secondaryFrequency = 0.7,
  staticYScale = 0.3,
  animated = true,
}: FluidWaveProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Enhanced shader for smooth ribbon-like fluid waves
  const vertexShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uWaveStrength;
    uniform float uScrollSpeed;
    uniform float uFrequency;
    uniform float uSecondaryFrequency;
    uniform float uStaticYScale;

    void main() {
      vUv = uv;
      vec3 pos = position;

      float phasePrimary = pos.x * uFrequency + uTime * uScrollSpeed;
      float phaseSecondary = pos.x * uSecondaryFrequency + uTime * uScrollSpeed * 1.15;

      float ribbon = sin(phasePrimary) * 0.7 + sin(phaseSecondary) * 0.3;
      float staticDepth = sin(pos.y * uStaticYScale) * 0.18;

      float displacement = ribbon * uWaveStrength + staticDepth;

      pos.z += displacement;
      vDisplacement = displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uColorScrollSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform vec3 uColor5;

    void main() {
      vec2 uv = vUv;

      float scroll = fract(uv.x + uTime * uColorScrollSpeed);
      float gradient1 = smoothstep(0.0, 1.0, scroll);
      float gradient2 = smoothstep(0.0, 1.0, fract(scroll * 1.35 + 0.1));
      float accent = sin((uv.x + uTime * uColorScrollSpeed) * 6.28318) * 0.5 + 0.5;
      float verticalMix = smoothstep(0.0, 1.0, uv.y);

      vec3 colorA = mix(uColor1, uColor2, gradient1);
      vec3 colorB = mix(uColor3, uColor4, gradient2);
      vec3 colorC = mix(uColor2, uColor5, accent);

      vec3 finalColor = mix(colorA, colorB, 0.4 + verticalMix * 0.4);
      finalColor = mix(finalColor, colorC, 0.35);

      float depth = clamp(vDisplacement * 0.25 + 0.7, 0.4, 1.2);
      finalColor *= depth;

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uWaveStrength: { value: waveStrength },
    uScrollSpeed: { value: scrollSpeed },
    uFrequency: { value: frequency },
    uSecondaryFrequency: { value: secondaryFrequency },
    uStaticYScale: { value: staticYScale },
    uColorScrollSpeed: { value: colorScrollSpeed },
    uColor1: { value: new THREE.Color('#0f0f23') }, // Deep navy
    uColor2: { value: new THREE.Color('#1e3a8a') }, // Deep blue
    uColor3: { value: new THREE.Color('#3b82f6') }, // Bright blue
    uColor4: { value: new THREE.Color('#8b5cf6') }, // Purple
    uColor5: { value: new THREE.Color('#ec4899') }, // Bright pink/magenta
  }), [waveStrength, scrollSpeed, frequency, secondaryFrequency, staticYScale, colorScrollSpeed]);

  useEffect(() => {
    uniforms.uWaveStrength.value = waveStrength;
    uniforms.uScrollSpeed.value = scrollSpeed;
    uniforms.uFrequency.value = frequency;
    uniforms.uSecondaryFrequency.value = secondaryFrequency;
    uniforms.uStaticYScale.value = staticYScale;
    uniforms.uColorScrollSpeed.value = colorScrollSpeed;
  }, [waveStrength, scrollSpeed, frequency, secondaryFrequency, staticYScale, colorScrollSpeed, uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = animated ? state.clock.elapsedTime : 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]} rotation={[-Math.PI / 12, 0, 0]}>
      <planeGeometry args={[60, 45, 300, 225]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Secondary ribbon layer for depth and complexity
type FluidWaveLayerProps = {
  scrollSpeed?: number;
  colorScrollSpeed?: number;
  waveStrength?: number;
  frequency?: number;
  secondaryFrequency?: number;
  staticYScale?: number;
  animated?: boolean;
};

export function FluidWaveLayer({
  scrollSpeed = 0.35,
  colorScrollSpeed = 0.12,
  waveStrength = 1.5,
  frequency = 0.45,
  secondaryFrequency = 0.75,
  staticYScale = 0.25,
  animated = true,
}: FluidWaveLayerProps = {}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uScrollSpeed;
    uniform float uWaveStrength;
    uniform float uFrequency;
    uniform float uSecondaryFrequency;
    uniform float uStaticYScale;

    void main() {
      vUv = uv;
      vec3 pos = position;

      float phasePrimary = pos.x * uFrequency + uTime * uScrollSpeed;
      float phaseSecondary = pos.x * uSecondaryFrequency + uTime * uScrollSpeed * 1.1;

      float ribbon = sin(phasePrimary) * 0.6 + sin(phaseSecondary) * 0.4;
      float staticDepth = sin(pos.y * uStaticYScale) * 0.12;

      float displacement = ribbon * uWaveStrength + staticDepth;

      pos.z += displacement;
      vDisplacement = displacement;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying float vDisplacement;
    uniform float uTime;
    uniform float uColorScrollSpeed;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    void main() {
      vec2 uv = vUv;
      float scroll = fract(uv.x + uTime * uColorScrollSpeed);
      float gradient1 = smoothstep(0.15, 0.85, scroll);
      float gradient2 = smoothstep(0.1, 0.9, fract(scroll * 1.4 + 0.2));
      float accent = sin((uv.x + uTime * uColorScrollSpeed) * 4.5) * 0.5 + 0.5;

      vec3 color1 = mix(uColor1, uColor2, gradient1);
      vec3 color2 = mix(uColor2, uColor3, gradient2);
      vec3 finalColor = mix(color1, color2, 0.6 + accent * 0.2);

      float alpha = clamp(0.5 + vDisplacement * 0.25, 0.35, 0.75);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollSpeed: { value: scrollSpeed },
    uWaveStrength: { value: waveStrength },
    uFrequency: { value: frequency },
    uSecondaryFrequency: { value: secondaryFrequency },
    uStaticYScale: { value: staticYScale },
    uColorScrollSpeed: { value: colorScrollSpeed },
    uColor1: { value: new THREE.Color('#6366f1') }, // Indigo
    uColor2: { value: new THREE.Color('#a855f7') }, // Purple
    uColor3: { value: new THREE.Color('#ec4899') }, // Pink
  }), [scrollSpeed, waveStrength, frequency, secondaryFrequency, staticYScale, colorScrollSpeed]);

  useEffect(() => {
    uniforms.uScrollSpeed.value = scrollSpeed;
    uniforms.uWaveStrength.value = waveStrength;
    uniforms.uFrequency.value = frequency;
    uniforms.uSecondaryFrequency.value = secondaryFrequency;
    uniforms.uStaticYScale.value = staticYScale;
    uniforms.uColorScrollSpeed.value = colorScrollSpeed;
  }, [scrollSpeed, waveStrength, frequency, secondaryFrequency, staticYScale, colorScrollSpeed, uniforms]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = animated ? state.clock.elapsedTime : 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -4]} rotation={[-Math.PI / 16, 0, 0]}>
      <planeGeometry args={[70, 55, 200, 150]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}