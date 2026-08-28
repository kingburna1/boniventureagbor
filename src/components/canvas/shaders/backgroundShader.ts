export const BackgroundVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uGlobalScroll;
  uniform float uContinuousSection; // 0.0 -> 5.0
  uniform float uHeroProgress;       // 0 -> 1
  uniform float uAboutProgress;      // 0 -> 1
  uniform float uProjectsProgress;   // 0 -> 1
  uniform float uExperienceProgress; // 0 -> 1
  uniform float uSkillsProgress;     // 0 -> 1
  uniform float uContactProgress;    // 0 -> 1
  uniform float uIntensity;          // Section interpolated intensity [0.2, 1.0]
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
  varying float vSection;
  varying float vIntensity;
  varying vec3 vRandomness;

  // 3D Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    float timeSpeed = uReducedMotion > 0.5 ? 0.03 : (0.10 + aSpeed * 0.06);
    float t = uTime * timeSpeed + aPhase;

    // Continuous section weights (smooth Gaussian-like bell curves)
    float s = uContinuousSection;
    float wHero = max(0.0, 1.0 - abs(s - 0.0));
    float wAbout = max(0.0, 1.0 - abs(s - 1.0));
    float wProjects = max(0.0, 1.0 - abs(s - 2.0));
    float wExperience = max(0.0, 1.0 - abs(s - 3.0));
    float wSkills = max(0.0, 1.0 - abs(s - 4.0));
    float wContact = max(0.0, 1.0 - abs(s - 5.0));

    // 1. HERO SECTION: Strong ambient organic wave + simplex noise
    float heroNoise = snoise(vec3(pos.x * 0.12 + t * 0.25, pos.y * 0.12, pos.z * 0.12));
    vec3 heroOffset = vec3(
      sin(t + aRandomness.x * 6.28) * 0.35 + heroNoise * 0.8,
      cos(t * 0.8 + aRandomness.y * 6.28) * 0.4 - (uHeroProgress * 2.5),
      sin(t * 0.5 + pos.x * 0.15) * 0.6
    );

    // 2. ABOUT SECTION: Calmer, subdued drift to ensure high reading focus
    vec3 aboutOffset = vec3(
      sin(t * 0.3 + aRandomness.x * 6.28) * 0.12,
      cos(t * 0.3 + aRandomness.y * 6.28) * 0.12,
      -1.5 // gentle push back into deeper background
    );

    // 3. PROJECTS SECTION: Stratified depth wave reacting gently to scroll
    float projectWave = sin(pos.y * 0.25 + uProjectsProgress * 3.14159 + t * 0.5);
    vec3 projectsOffset = vec3(
      sin(t * 0.5 + aRandomness.x) * 0.25,
      projectWave * 0.5,
      projectWave * 1.2 - 0.5
    );

    // 4. EXPERIENCE SECTION: Ascending/progressive vertical current
    float verticalFlow = mod(t * 1.5 + aRandomness.y * 12.0, 16.0) - 8.0;
    vec3 experienceOffset = vec3(
      sin(t * 0.6 + pos.y * 0.2) * 0.3,
      verticalFlow * 0.25 + (uExperienceProgress - 0.5) * 2.0,
      sin(pos.x * 0.2 + t * 0.4) * 0.4
    );

    // 5. SKILLS SECTION: Technical grid lattice alignment
    vec3 skillsGridTarget = mix(pos, aGridPos, 0.42);
    vec3 skillsOffset = (skillsGridTarget - pos) + vec3(
      sin(t * 0.4 + aRandomness.x * 3.14) * 0.15,
      cos(t * 0.4 + aRandomness.y * 3.14) * 0.15,
      0.0
    );

    // 6. CONTACT SECTION: Stable, calm settling into quiet ambient space
    vec3 contactOffset = vec3(
      sin(t * 0.2 + aRandomness.x * 6.28) * 0.08,
      cos(t * 0.2 + aRandomness.y * 6.28) * 0.08,
      -2.0
    );

    // Blend all section states smoothly using weights
    vec3 blendedOffset = heroOffset * wHero
                       + aboutOffset * wAbout
                       + projectsOffset * wProjects
                       + experienceOffset * wExperience
                       + skillsOffset * wSkills
                       + contactOffset * wContact;

    if (uReducedMotion > 0.5) {
      blendedOffset *= 0.25;
    }

    pos += blendedOffset;

    // Mouse parallax reaction (subtle tactile depth)
    if (uReducedMotion < 0.5) {
      float mouseDist = length(pos.xy - uMouse * 6.0);
      float mouseInfluence = smoothstep(5.0, 0.0, mouseDist);
      pos.xy += uMouse * 0.4;
      pos.z += mouseInfluence * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Responsive Point Size based on camera distance, scale & section intensity
    float baseSize = aScale * uPixelRatio * (30.0 / -mvPosition.z);
    float sizeMod = 0.75 + 0.35 * uIntensity;
    gl_PointSize = max(1.5, baseSize * sizeMod);

    vPosition = pos;
    vDistance = -mvPosition.z;
    vSection = uContinuousSection;
    vIntensity = uIntensity;
    vRandomness = aRandomness;
  }
`;

export const BackgroundFragmentShader = /* glsl */ `
  uniform vec3 uColorAccent;
  uniform vec3 uColorSecondary;
  uniform vec3 uColorTertiary;
  uniform float uOpacity;
  uniform float uIsDark;
  uniform float uIntensity;

  varying vec3 vPosition;
  varying float vDistance;
  varying float vSection;
  varying float vIntensity;
  varying vec3 vRandomness;

  void main() {
    // Exact circular soft particle point
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;

    // Soft Gaussian radial falloff
    float radialAlpha = smoothstep(0.5, 0.04, dist);

    // Distance fog falloff (soft depth fade)
    float depthAlpha = smoothstep(32.0, 3.5, vDistance);

    // Overall alpha modulated by section intensity and theme opacity
    float alpha = radialAlpha * depthAlpha * uOpacity * (0.6 + 0.4 * vIntensity);

    // Section-Aware Color Palette Interpolation
    // Hero: Accent -> Secondary
    // About: Calmer Secondary -> Blue
    // Projects: Electric Accent -> Violet
    // Experience: Emerald / Multi-spectrum blend
    // Skills: Cyan / Tech Violet
    // Contact: Calm Indigo
    float s = vSection;
    vec3 colHero = mix(uColorAccent, uColorSecondary, vRandomness.x);
    vec3 colAbout = mix(uColorAccent * 0.8, uColorSecondary * 0.7, 0.5);
    vec3 colProjects = mix(uColorSecondary, uColorTertiary, vRandomness.y);
    vec3 colExperience = mix(vec3(0.06, 0.75, 0.55), uColorAccent, vRandomness.z); // emerald -> blue
    vec3 colSkills = mix(uColorSecondary, vec3(0.02, 0.8, 0.85), vRandomness.x);    // violet -> cyan
    vec3 colContact = mix(uColorAccent * 0.7, uColorSecondary * 0.6, 0.3);

    float wHero = max(0.0, 1.0 - abs(s - 0.0));
    float wAbout = max(0.0, 1.0 - abs(s - 1.0));
    float wProjects = max(0.0, 1.0 - abs(s - 2.0));
    float wExperience = max(0.0, 1.0 - abs(s - 3.0));
    float wSkills = max(0.0, 1.0 - abs(s - 4.0));
    float wContact = max(0.0, 1.0 - abs(s - 5.0));

    vec3 finalColor = colHero * wHero
                    + colAbout * wAbout
                    + colProjects * wProjects
                    + colExperience * wExperience
                    + colSkills * wSkills
                    + colContact * wContact;

    // Normalize in case of overlap
    float totalWeight = wHero + wAbout + wProjects + wExperience + wSkills + wContact;
    if (totalWeight > 0.001) {
      finalColor /= totalWeight;
    }

    // Light theme contrast protection (ensures text readability on white/light gray backgrounds)
    if (uIsDark < 0.5) {
      finalColor = mix(finalColor, vec3(0.12, 0.22, 0.45), 0.4);
      alpha *= 0.65;
    }

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
