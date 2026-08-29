/**
 * WHITE ARCHITECTURAL SILK — LIGHT THEME SHADERS
 * Layer 01 & 02: Liquid Silk Atmospheric Surface
 * Layer 03: Precision Architectural Technical Grid
 * Layer 04: Sparse Monochrome Graphite Particles
 */

// ============================================================================
// 1. LIQUID SILK ATMOSPHERE SHADERS
// ============================================================================

export const SilkAtmosphereVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const SilkAtmosphereFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlobalScroll;
  uniform float uContinuousSection; // 0.0 (hero) -> 5.0 (contact)
  uniform float uIntensity;          // Section modulated intensity
  uniform vec2 uMouse;
  uniform vec2 uResolution;
  uniform float uReducedMotion;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Precision 2D Simplex / FBM Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Smooth Domain-Warped Silk Texture
  float silkNoise(vec2 p, float t) {
    vec2 q = vec2(
      snoise(p + vec2(0.0, t * 0.3)),
      snoise(p + vec2(5.2, 1.3 - t * 0.25))
    );
    vec2 r = vec2(
      snoise(p + 2.0 * q + vec2(1.7, 9.2 + t * 0.2)),
      snoise(p + 2.0 * q + vec2(8.3, 2.8 - t * 0.15))
    );
    return snoise(p + 1.6 * r);
  }

  void main() {
    vec2 aspect = vec2(max(1.0, uResolution.x / max(1.0, uResolution.y)), 1.0);
    vec2 p = (vUv - 0.5) * aspect * 1.8;

    float t = uTime * (uReducedMotion > 0.5 ? 0.0 : 0.035);

    // Section weights for smooth continuous transitions
    float s = uContinuousSection;
    float wHero = max(0.0, 1.0 - abs(s - 0.0));
    float wAbout = max(0.0, 1.0 - abs(s - 1.0));
    float wProjects = max(0.0, 1.0 - abs(s - 2.0));
    float wExperience = max(0.0, 1.0 - abs(s - 3.0));
    float wSkills = max(0.0, 1.0 - abs(s - 4.0));
    float wContact = max(0.0, 1.0 - abs(s - 5.0));

    // Subtle tactile mouse influence (organic fluid push)
    if (uReducedMotion < 0.5) {
      vec2 mouseNorm = (uMouse * 0.5);
      float mouseDist = length(p - mouseNorm * aspect);
      float mousePush = smoothstep(1.2, 0.0, mouseDist) * 0.06;
      p += (p - mouseNorm * aspect) * mousePush;
    }

    // Scroll vertical progression influence
    p.y -= uGlobalScroll * 0.6;

    // Silk flow pattern with multi-scale harmonics
    float waveA = silkNoise(p * 0.9, t);
    float waveB = silkNoise(p * 1.8 + vec2(2.4, -1.8), t * 1.2);
    float silkField = waveA * 0.7 + waveB * 0.3;

    // Section-specific silk amplitude modulation
    // Hero: Maximum organic silk wave
    // About: Flatter, extremely calm for reading
    // Projects: Stratified diagonal depth
    // Experience: Vertical drape
    // Skills: Tighter geometric contours
    // Contact: Whispering, settled calm
    float sectionSilkAmp = wHero * 1.0 +
                           wAbout * 0.35 +
                           wProjects * 0.75 +
                           wExperience * 0.65 +
                           wSkills * 0.50 +
                           wContact * 0.25;

    float silkFold = smoothstep(-0.85, 0.85, silkField * sectionSilkAmp);

    // Subtle directional lighting sheen (architectural illumination)
    vec2 lightDir = normalize(vec2(0.6, 0.8));
    float lightSheen = smoothstep(-0.5, 0.7, dot(normalize(p + vec2(waveA, waveB) * 0.5), lightDir)) * 0.04;

    // Light Theme Color Tones (Calibrated for #FAFAF8 base)
    vec3 baseWarmWhite   = vec3(0.980, 0.980, 0.973); // #FAFAF8 base
    vec3 subtleIvory     = vec3(0.965, 0.960, 0.948); // warm ivory fold
    vec3 coolSilver      = vec3(0.945, 0.948, 0.955); // cool mist shadow
    vec3 faintSlate      = vec3(0.932, 0.936, 0.948); // architectural shadow fold

    // Color gradient interpolation based on silk fold
    vec3 silkColor = mix(baseWarmWhite, subtleIvory, smoothstep(0.0, 0.5, silkFold));
    silkColor = mix(silkColor, coolSilver, smoothstep(0.4, 0.85, silkFold));
    silkColor = mix(silkColor, faintSlate, smoothstep(0.75, 1.0, silkFold) * 0.45);

    // Add delicate ambient sheen
    silkColor += vec3(lightSheen);

    // Vignette / border softness to blend into viewport edge
    float vignette = smoothstep(1.6, 0.3, length(p / aspect));
    silkColor = mix(baseWarmWhite, silkColor, vignette * 0.92);

    gl_FragColor = vec4(silkColor, 1.0);
  }
`;

// ============================================================================
// 2. ARCHITECTURAL TECHNICAL GRID SHADERS
// ============================================================================

export const TechnicalGridVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const TechnicalGridFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlobalScroll;
  uniform float uContinuousSection;
  uniform float uIntensity;
  uniform vec2 uResolution;
  uniform float uReducedMotion;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vec2 aspect = vec2(max(1.0, uResolution.x / max(1.0, uResolution.y)), 1.0);
    vec2 p = (vUv - 0.5) * aspect;

    // Scroll vertical parallax offset
    p.y += uGlobalScroll * 0.15;

    // Section progression weights
    float s = uContinuousSection;
    float wHero = max(0.0, 1.0 - abs(s - 0.0));
    float wAbout = max(0.0, 1.0 - abs(s - 1.0));
    float wProjects = max(0.0, 1.0 - abs(s - 2.0));
    float wExperience = max(0.0, 1.0 - abs(s - 3.0));
    float wSkills = max(0.0, 1.0 - abs(s - 4.0));
    float wContact = max(0.0, 1.0 - abs(s - 5.0));

    // Section Grid Opacity Mapping:
    // Hero: 0.020 (barely visible whisper)
    // About: 0.030 (clean structure)
    // Projects: 0.045 (subtle execution)
    // Experience: 0.055 (system progression)
    // Skills: 0.075 (maximum technical depth)
    // Contact: 0.025 (settled completion)
    float baseGridAlpha = wHero * 0.020 +
                          wAbout * 0.030 +
                          wProjects * 0.045 +
                          wExperience * 0.055 +
                          wSkills * 0.075 +
                          wContact * 0.025;

    // Grid coordinates (Scale in aspect space)
    float majorScale = 0.28; // Major architectural unit
    float minorScale = 0.07; // 1/4 Subdivisions

    vec2 majorUv = p / majorScale;
    vec2 minorUv = p / minorScale;

    // Derivative-based subpixel line anti-aliasing
    vec2 majorGrid = abs(fract(majorUv - 0.5) - 0.5) / (fwidth(majorUv) + 0.0001);
    float majorLine = 1.0 - min(min(majorGrid.x, majorGrid.y), 1.0);

    vec2 minorGrid = abs(fract(minorUv - 0.5) - 0.5) / (fwidth(minorUv) + 0.0001);
    float minorLine = 1.0 - min(min(minorGrid.x, minorGrid.y), 1.0);

    // Architectural Intersection Crosshairs "+" at major grid nodes
    vec2 nodeUv = abs(fract(majorUv - 0.5) - 0.5);
    float crossWidth = 0.045;
    float crossLength = 0.16;
    float crosshair = (step(nodeUv.x, crossWidth) * step(nodeUv.y, crossLength)) +
                      (step(nodeUv.y, crossWidth) * step(nodeUv.x, crossLength));
    crosshair = min(1.0, crosshair);

    // Radial distance fade (keeps center/edges soft, never abrupt)
    float radialMask = smoothstep(1.35, 0.25, length(p / aspect));

    // Combine lines and crosshairs with restrained weights
    float gridPattern = (majorLine * 0.65 + minorLine * 0.25 + crosshair * 0.45);
    float finalAlpha = gridPattern * baseGridAlpha * radialMask;

    // Low-contrast graphite tone (#334155 / slate-700)
    vec3 graphiteColor = vec3(0.20, 0.25, 0.33);

    if (finalAlpha <= 0.001) {
      discard;
    }

    gl_FragColor = vec4(graphiteColor, finalAlpha);
  }
`;

// ============================================================================
// 3. SPARSE MONOCHROME GRAPHITE PARTICLES SHADERS
// ============================================================================

export const MonochromeParticleVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlobalScroll;
  uniform float uContinuousSection;
  uniform float uIntensity;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uReducedMotion;

  attribute float aScale;
  attribute vec3 aRandomness;
  attribute float aSpeed;
  attribute vec3 aGridPos;
  attribute float aPhase;

  varying vec3 vPosition;
  varying float vDistance;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float timeSpeed = uReducedMotion > 0.5 ? 0.01 : (0.04 + aSpeed * 0.03);
    float t = uTime * timeSpeed + aPhase;

    float s = uContinuousSection;
    float wSkills = max(0.0, 1.0 - abs(s - 4.0));

    // Slow, subtle organic drifting
    vec3 drift = vec3(
      sin(t + aRandomness.x * 6.28) * 0.22,
      cos(t * 0.9 + aRandomness.y * 6.28) * 0.22 - (uGlobalScroll * 1.5),
      sin(t * 0.5 + aRandomness.z * 6.28) * 0.2
    );

    // In Skills section, gently bias particles toward structured grid nodes
    vec3 gridTarget = mix(pos, aGridPos, 0.45);
    pos += drift + (gridTarget - pos) * (wSkills * 0.4);

    // Mouse parallax reaction
    if (uReducedMotion < 0.5) {
      float mouseDist = length(pos.xy - uMouse * 4.0);
      float mousePush = smoothstep(4.0, 0.0, mouseDist) * 0.25;
      pos.xy += uMouse * 0.2;
      pos.z += mousePush;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Compact restrained point sizing
    float baseSize = aScale * uPixelRatio * (22.0 / -mvPosition.z);
    gl_PointSize = max(1.2, min(4.5, baseSize));

    vPosition = pos;
    vDistance = -mvPosition.z;
    vAlpha = 0.18 + 0.12 * aRandomness.z;
  }
`;

export const MonochromeParticleFragmentShader = /* glsl */ `
  varying vec3 vPosition;
  varying float vDistance;
  varying float vAlpha;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // Soft Gaussian circular point profile
    float radial = smoothstep(0.5, 0.08, dist);

    // Depth distance falloff
    float depthAlpha = smoothstep(30.0, 4.0, vDistance);

    // Matte graphite tone (#475569)
    vec3 graphiteTone = vec3(0.28, 0.33, 0.41);

    gl_FragColor = vec4(graphiteTone, radial * depthAlpha * vAlpha);
  }
`;
