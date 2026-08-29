'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { BackgroundVertexShader, BackgroundFragmentShader } from './shaders/backgroundShader';
import { webglScrollController } from '@/lib/webglStore';

export interface DarkBackgroundSceneProps {
  particleCount?: number;
}

export const DarkBackgroundScene: React.FC<DarkBackgroundSceneProps> = ({
  particleCount = 1200,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Mouse & Scroll Lerp Coordinates
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));

  const currentContinuousSection = useRef(0);
  const currentIntensity = useRef(1.0);
  const isReducedMotion = useRef(false);

  // Section Intensity mapping:
  // Hero (1.0) -> About (0.35) -> Projects (0.8) -> Experience (0.75) -> Skills (0.9) -> Contact (0.3)
  const SECTION_INTENSITIES = useMemo(() => [1.0, 0.35, 0.8, 0.75, 0.9, 0.3], []);

  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Geometry attributes generated ONCE (Zero allocation during render)
  const [positions, scales, randomness, speeds, gridPositions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sc = new Float32Array(particleCount);
    const rand = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);
    const grid = new Float32Array(particleCount * 3);
    const ph = new Float32Array(particleCount);

    // Compute grid dimensions for the Skills section lattice
    const cols = Math.ceil(Math.sqrt(particleCount * 1.5));
    const rows = Math.ceil(particleCount / cols);
    const spacingX = 26 / cols;
    const spacingY = 22 / rows;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Spread across deep 3D view frustum
      pos[i3] = (Math.random() - 0.5) * 28;
      pos[i3 + 1] = (Math.random() - 0.5) * 24;
      pos[i3 + 2] = (Math.random() - 0.5) * 18 - 3;

      sc[i] = Math.random() * 1.6 + 0.6;

      rand[i3] = Math.random();
      rand[i3 + 1] = Math.random();
      rand[i3 + 2] = Math.random();

      sp[i] = Math.random() * 0.8 + 0.4;
      ph[i] = Math.random() * Math.PI * 2;

      // Structured grid target for skills
      const col = i % cols;
      const row = Math.floor(i / cols);
      grid[i3] = (col - cols / 2) * spacingX + (Math.random() - 0.5) * 0.4;
      grid[i3 + 1] = (row - rows / 2) * spacingY + (Math.random() - 0.5) * 0.4;
      grid[i3 + 2] = (Math.random() - 0.5) * 4 - 2;
    }

    return [pos, sc, rand, sp, grid, ph];
  }, [particleCount]);

  // Shader Uniforms Reference Map
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGlobalScroll: { value: 0 },
      uContinuousSection: { value: 0 },
      uHeroProgress: { value: 0 },
      uAboutProgress: { value: 0 },
      uProjectsProgress: { value: 0 },
      uExperienceProgress: { value: 0 },
      uSkillsProgress: { value: 0 },
      uContactProgress: { value: 0 },
      uIntensity: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.8) },
      uReducedMotion: { value: 0.0 },
      uColorAccent: { value: new THREE.Color('#3b82f6') },
      uColorSecondary: { value: new THREE.Color('#8b5cf6') },
      uColorTertiary: { value: new THREE.Color('#ec4899') },
      uOpacity: { value: 0.75 },
      uIsDark: { value: 1.0 },
    }),
    []
  );

  // 60/120fps Zero-React-State Render Loop
  useFrame((state, delta) => {
    if (!materialRef.current) return;

    const scrollState = webglScrollController.getState();
    const u = materialRef.current.uniforms;

    // Time advancement
    if (!isReducedMotion.current) {
      u.uTime.value += delta;
      u.uReducedMotion.value = 0.0;
    } else {
      u.uTime.value += delta * 0.15;
      u.uReducedMotion.value = 1.0;
    }

    // Lerp Mouse Pointer
    currentMouse.current.lerp(targetMouse.current, 0.05);
    u.uMouse.value.copy(currentMouse.current);

    // Continuous section progress lerping for seamless organic transitions
    currentContinuousSection.current = THREE.MathUtils.lerp(
      currentContinuousSection.current,
      scrollState.continuousSectionIndex,
      0.08
    );
    u.uContinuousSection.value = currentContinuousSection.current;

    // Target intensity based on active section
    const activeIdx = Math.min(scrollState.activeSectionIndex, SECTION_INTENSITIES.length - 1);
    const targetIntensity = SECTION_INTENSITIES[activeIdx];
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, targetIntensity, 0.06);
    u.uIntensity.value = currentIntensity.current;

    // Direct uniform updates
    u.uGlobalScroll.value = scrollState.globalScroll;
    u.uHeroProgress.value = scrollState.hero;
    u.uAboutProgress.value = scrollState.about;
    u.uProjectsProgress.value = scrollState.projects;
    u.uExperienceProgress.value = scrollState.experience;
    u.uSkillsProgress.value = scrollState.skills;
    u.uContactProgress.value = scrollState.contact;

    // Subtle gentle camera orientation shift
    if (!isReducedMotion.current) {
      state.camera.position.x = currentMouse.current.x * 0.3;
      state.camera.position.y = currentMouse.current.y * 0.2;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={scales.length}
          array={scales}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aRandomness"
          count={randomness.length / 3}
          array={randomness}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSpeed"
          count={speeds.length}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aGridPos"
          count={gridPositions.length / 3}
          array={gridPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          count={phases.length}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={BackgroundVertexShader}
        fragmentShader={BackgroundFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
