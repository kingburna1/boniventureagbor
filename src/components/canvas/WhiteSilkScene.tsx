'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  SilkAtmosphereVertexShader,
  SilkAtmosphereFragmentShader,
  TechnicalGridVertexShader,
  TechnicalGridFragmentShader,
  MonochromeParticleVertexShader,
  MonochromeParticleFragmentShader,
} from './shaders/whiteSilkShader';
import { webglScrollController } from '@/lib/webglStore';

export interface WhiteSilkSceneProps {
  particleCount?: number;
}

export const WhiteSilkScene: React.FC<WhiteSilkSceneProps> = ({
  particleCount: requestedParticleCount = 200,
}) => {
  const { size, viewport } = useThree();

  // Material refs for 60/120fps direct uniform updates
  const silkMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const gridMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // Mouse & Section Tracking Refs
  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));
  const currentContinuousSection = useRef(0);
  const currentIntensity = useRef(1.0);
  const isReducedMotion = useRef(false);

  // Dynamic particle count calibrated for device tier (sparse & restrained)
  const actualParticleCount = useMemo(() => {
    if (typeof window === 'undefined') return 120;
    const isMobile = window.innerWidth < 768;
    return isMobile ? Math.min(80, requestedParticleCount) : Math.min(220, requestedParticleCount);
  }, [requestedParticleCount]);

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

  // Geometry attributes for Layer 04 (Sparse Monochrome Particles)
  const [positions, scales, randomness, speeds, gridPositions, phases] = useMemo(() => {
    const count = actualParticleCount;
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const rand = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const grid = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    const cols = Math.ceil(Math.sqrt(count * 1.4));
    const rows = Math.ceil(count / cols);
    const spacingX = 24 / cols;
    const spacingY = 20 / rows;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 26;
      pos[i3 + 1] = (Math.random() - 0.5) * 22;
      pos[i3 + 2] = (Math.random() - 0.5) * 14 - 2;

      sc[i] = Math.random() * 1.4 + 0.7;

      rand[i3] = Math.random();
      rand[i3 + 1] = Math.random();
      rand[i3 + 2] = Math.random();

      sp[i] = Math.random() * 0.6 + 0.3;
      ph[i] = Math.random() * Math.PI * 2;

      const col = i % cols;
      const row = Math.floor(i / cols);
      grid[i3] = (col - cols / 2) * spacingX + (Math.random() - 0.5) * 0.3;
      grid[i3 + 1] = (row - rows / 2) * spacingY + (Math.random() - 0.5) * 0.3;
      grid[i3 + 2] = (Math.random() - 0.5) * 3 - 1;
    }

    return [pos, sc, rand, sp, grid, ph];
  }, [actualParticleCount]);

  // Shared Base Uniforms
  const sharedUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGlobalScroll: { value: 0 },
      uContinuousSection: { value: 0 },
      uIntensity: { value: 1.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: {
        value: new THREE.Vector2(
          typeof window !== 'undefined' ? window.innerWidth : 1920,
          typeof window !== 'undefined' ? window.innerHeight : 1080
        ),
      },
      uPixelRatio: {
        value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.8),
      },
      uReducedMotion: { value: 0.0 },
    }),
    []
  );

  // Update resolution on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateRes = () => {
      const res = new THREE.Vector2(window.innerWidth, window.innerHeight);
      if (silkMaterialRef.current) silkMaterialRef.current.uniforms.uResolution.value.copy(res);
      if (gridMaterialRef.current) gridMaterialRef.current.uniforms.uResolution.value.copy(res);
    };
    window.addEventListener('resize', updateRes, { passive: true });
    return () => window.removeEventListener('resize', updateRes);
  }, []);

  // Dedicated Render Loop (Zero React State allocations)
  useFrame((state, delta) => {
    const scrollState = webglScrollController.getState();
    const dt = isReducedMotion.current ? delta * 0.1 : delta;

    // Smooth Mouse Lerp
    currentMouse.current.lerp(targetMouse.current, 0.045);

    // Smooth Continuous Section Lerp (0.0 to 5.0)
    currentContinuousSection.current = THREE.MathUtils.lerp(
      currentContinuousSection.current,
      scrollState.continuousSectionIndex,
      0.075
    );

    // Section intensity mapping (calm reading vs structural focus)
    // Hero (1.0) -> About (0.35) -> Projects (0.75) -> Experience (0.65) -> Skills (0.85) -> Contact (0.3)
    const SECTION_INTENSITIES = [1.0, 0.35, 0.75, 0.65, 0.85, 0.3];
    const activeIdx = Math.min(scrollState.activeSectionIndex, SECTION_INTENSITIES.length - 1);
    const targetIntensity = SECTION_INTENSITIES[activeIdx];
    currentIntensity.current = THREE.MathUtils.lerp(currentIntensity.current, targetIntensity, 0.06);

    const materials = [
      silkMaterialRef.current,
      gridMaterialRef.current,
      particleMaterialRef.current,
    ];

    materials.forEach((mat) => {
      if (!mat) return;
      mat.uniforms.uTime.value += dt;
      mat.uniforms.uGlobalScroll.value = scrollState.globalScroll;
      mat.uniforms.uContinuousSection.value = currentContinuousSection.current;
      mat.uniforms.uIntensity.value = currentIntensity.current;
      mat.uniforms.uMouse.value.copy(currentMouse.current);
      mat.uniforms.uReducedMotion.value = isReducedMotion.current ? 1.0 : 0.0;
    });

    // Subtle gentle camera orientation shift
    if (!isReducedMotion.current) {
      state.camera.position.x = currentMouse.current.x * 0.18;
      state.camera.position.y = currentMouse.current.y * 0.14;
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group>
      {/* LAYER 01 & 02: LIQUID SILK ATMOSPHERE */}
      <mesh position={[0, 0, -2]}>
        <planeGeometry args={[32, 26, 1, 1]} />
        <shaderMaterial
          ref={silkMaterialRef}
          vertexShader={SilkAtmosphereVertexShader}
          fragmentShader={SilkAtmosphereFragmentShader}
          uniforms={sharedUniforms}
          transparent={false}
          depthWrite={false}
        />
      </mesh>

      {/* LAYER 03: ARCHITECTURAL TECHNICAL GRID */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[32, 26, 1, 1]} />
        <shaderMaterial
          ref={gridMaterialRef}
          vertexShader={TechnicalGridVertexShader}
          fragmentShader={TechnicalGridFragmentShader}
          uniforms={sharedUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* LAYER 04: SPARSE MONOCHROME PARTICLES */}
      <points>
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
          ref={particleMaterialRef}
          vertexShader={MonochromeParticleVertexShader}
          fragmentShader={MonochromeParticleFragmentShader}
          uniforms={sharedUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
};
