/**
 * Gramin PocketLab — 3D Glossy & Isometric Educational Art Engine
 * High-performance, zero-dependency, pure SVG 3D illustrations for STEM subjects,
 * tactile avatars, and interactive robotic study companions.
 * 
 * Supports responsive sizing, GPU-accelerated floating/orbiting animations,
 * specular highlights, and accessibility labelling.
 */

export function render3DAtom({ size = 84, className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative; filter: drop-shadow(0 12px 20px rgba(37, 99, 235, 0.25));" aria-hidden="true">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <!-- Specular Central Nucleus Gradients -->
          <radialGradient id="atomCoreGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stop-color="#93C5FD" />
            <stop offset="35%" stop-color="#3B82F6" />
            <stop offset="75%" stop-color="#1D4ED8" />
            <stop offset="100%" stop-color="#0F172A" />
          </radialGradient>
          <radialGradient id="protonGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#FCA5A5" />
            <stop offset="50%" stop-color="#EF4444" />
            <stop offset="100%" stop-color="#991B1B" />
          </radialGradient>
          <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#67E8F9" />
            <stop offset="50%" stop-color="#06B6D4" />
            <stop offset="100%" stop-color="rgba(6, 182, 212, 0)" />
          </radialGradient>
          <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.85" />
            <stop offset="50%" stop-color="#3B82F6" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#93C5FD" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#A78BFA" stop-opacity="0.85" />
            <stop offset="50%" stop-color="#6366F1" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#C4B5FD" stop-opacity="0.9" />
          </linearGradient>
          <linearGradient id="orbitGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.8" />
            <stop offset="50%" stop-color="#0284C7" stop-opacity="0.2" />
            <stop offset="100%" stop-color="#7DD3FC" stop-opacity="0.85" />
          </linearGradient>
          <!-- Specular Highlights Filter -->
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <!-- Dynamic Ambient Light Base -->
        <circle cx="50" cy="50" r="38" fill="url(#electronGlow)" opacity="0.4" />

        <!-- Orbit Track 1 (Tilted -35deg) -->
        <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(-35 50 50)" stroke="url(#orbitGrad1)" stroke-width="2.5" stroke-dasharray="2 0" />
        
        <!-- Orbit Track 2 (Tilted +35deg) -->
        <ellipse cx="50" cy="50" rx="42" ry="14" transform="rotate(35 50 50)" stroke="url(#orbitGrad2)" stroke-width="2.5" />

        <!-- Orbit Track 3 (Tilted 90deg / vertical) -->
        <ellipse cx="50" cy="50" rx="40" ry="12" transform="rotate(95 50 50)" stroke="url(#orbitGrad3)" stroke-width="2" />

        <!-- Orbiting Electrons with Glowing Halos -->
        <!-- Electron 1 -->
        <g class="anim-float-orb1">
          <circle cx="20" cy="30" r="4.5" fill="#67E8F9" filter="url(#softGlow)" />
          <circle cx="19" cy="28.5" r="1.5" fill="#FFFFFF" />
        </g>

        <!-- Electron 2 -->
        <g class="anim-float-orb2">
          <circle cx="80" cy="33" r="4" fill="#C4B5FD" filter="url(#softGlow)" />
          <circle cx="79" cy="31.5" r="1.2" fill="#FFFFFF" />
        </g>

        <!-- Electron 3 -->
        <g class="anim-float-orb3">
          <circle cx="48" cy="88" r="3.8" fill="#38BDF8" filter="url(#softGlow)" />
          <circle cx="47" cy="87" r="1.2" fill="#FFFFFF" />
        </g>

        <!-- Clustered 3D Glossy Nucleus -->
        <g class="anim-breathe-nucleus">
          <!-- Back Neutron -->
          <circle cx="44" cy="46" r="10" fill="url(#atomCoreGrad)" />
          <!-- Red Proton -->
          <circle cx="56" cy="45" r="9.5" fill="url(#protonGrad)" />
          <circle cx="53" cy="42" r="3" fill="#FFFFFF" opacity="0.75" />
          <!-- Blue Proton -->
          <circle cx="48" cy="57" r="9" fill="url(#atomCoreGrad)" />
          <circle cx="45" cy="54" r="2.8" fill="#FFFFFF" opacity="0.8" />
          <!-- Front Specular Glow Nucleus -->
          <circle cx="51" cy="50" r="11" fill="url(#atomCoreGrad)" />
          <ellipse cx="48" cy="46" rx="4.5" ry="2.8" transform="rotate(-25 48 46)" fill="#FFFFFF" opacity="0.85" />
          <circle cx="45" cy="44" r="1.5" fill="#FFFFFF" />
        </g>

        <!-- Micro Sparkle Flares -->
        <path d="M72 18 L73.5 22 L77.5 23.5 L73.5 25 L72 29 L70.5 25 L66.5 23.5 L70.5 22 Z" fill="#60A5FA" opacity="0.85" />
      </svg>
    </div>
  `;
}

export function render3DFlask({ size = 84, className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative; filter: drop-shadow(0 12px 20px rgba(147, 51, 234, 0.25));" aria-hidden="true">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <radialGradient id="flaskLiquid" cx="45%" cy="60%" r="55%">
            <stop offset="0%" stop-color="#E879F9" />
            <stop offset="45%" stop-color="#C026D3" />
            <stop offset="85%" stop-color="#9333EA" />
            <stop offset="100%" stop-color="#581C87" />
          </radialGradient>
          <linearGradient id="glassBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
            <stop offset="20%" stop-color="#E0E7FF" stop-opacity="0.25" />
            <stop offset="80%" stop-color="#C7D2FE" stop-opacity="0.15" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.7" />
          </linearGradient>
          <linearGradient id="liquidMeniscus" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F0ABFC" />
            <stop offset="50%" stop-color="#F5D0FE" />
            <stop offset="100%" stop-color="#D946EF" />
          </linearGradient>
          <filter id="bubbleBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <!-- Ambient Vapor Glow behind Neck -->
        <ellipse cx="50" cy="18" rx="16" ry="7" fill="#F0ABFC" opacity="0.35" filter="url(#bubbleBlur)" />

        <!-- Chemical Bubbles Rising from Flask -->
        <g class="anim-rise-bubble1">
          <circle cx="48" cy="22" r="3.2" fill="#E879F9" opacity="0.85" />
          <circle cx="47" cy="21" r="1" fill="#FFFFFF" />
        </g>
        <g class="anim-rise-bubble2">
          <circle cx="55" cy="14" r="4.2" fill="#C026D3" opacity="0.75" />
          <circle cx="53.8" cy="12.8" r="1.3" fill="#FFFFFF" />
        </g>
        <g class="anim-rise-bubble3">
          <circle cx="42" cy="8" r="2.8" fill="#F472B6" opacity="0.9" />
          <circle cx="41.2" cy="7.2" r="0.8" fill="#FFFFFF" />
        </g>

        <!-- Glass Flask Outer Wall Path (Back Shadow) -->
        <path d="M43 20 L43 38 L21 78 C18 84 22 90 29 90 L71 90 C78 90 82 84 79 78 L57 38 L57 20 Z" fill="rgba(243, 232, 255, 0.4)" stroke="rgba(216, 180, 254, 0.6)" stroke-width="2.5" />

        <!-- Internal Glowing Chemical Liquid -->
        <path d="M29 74 L37 54 C44 52 56 52 63 54 L71 74 C75 82 72 87 67 87 L33 87 C28 87 25 82 29 74 Z" fill="url(#flaskLiquid)" />

        <!-- Liquid Meniscus (Surface Wave) -->
        <ellipse cx="50" cy="54" rx="13" ry="3.5" fill="url(#liquidMeniscus)" />
        <ellipse cx="50" cy="54" rx="10" ry="2" fill="#FFFFFF" opacity="0.5" />

        <!-- Inside Liquid Submerged Bubbles -->
        <circle cx="42" cy="72" r="2.5" fill="#FFFFFF" opacity="0.5" />
        <circle cx="56" cy="68" r="3.2" fill="#FFFFFF" opacity="0.6" />
        <circle cx="50" cy="80" r="2" fill="#FFFFFF" opacity="0.4" />

        <!-- Glass Lip & Specular Highlight Rings -->
        <ellipse cx="50" cy="20" rx="9" ry="3.5" fill="#FFFFFF" stroke="#C084FC" stroke-width="2" />
        <ellipse cx="50" cy="20" rx="6" ry="2" fill="#FAF5FF" />

        <!-- Curved Specular Light Reflection Sweep (Front Glass) -->
        <path d="M45 22 L45 37 L26 74 C24 78 26 81 29 83" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <path d="M32 84 L38 86" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
        
        <!-- Measurement Graduation Ticks -->
        <line x1="56" y1="62" x2="62" y2="62" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.8" />
        <line x1="58" y1="70" x2="66" y2="70" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.8" />
        <line x1="60" y1="78" x2="70" y2="78" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.8" />
      </svg>
    </div>
  `;
}

export function render3DDNA({ size = 84, className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative; filter: drop-shadow(0 12px 20px rgba(16, 185, 129, 0.25));" aria-hidden="true">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <radialGradient id="dnaNodeEmerald" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#6EE7B7" />
            <stop offset="45%" stop-color="#10B981" />
            <stop offset="90%" stop-color="#047857" />
            <stop offset="100%" stop-color="#064E3B" />
          </radialGradient>
          <radialGradient id="dnaNodeTeal" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#5EEAD4" />
            <stop offset="45%" stop-color="#14B8A6" />
            <stop offset="90%" stop-color="#0F766E" />
            <stop offset="100%" stop-color="#134E4A" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#86EFAC" />
            <stop offset="50%" stop-color="#22C55E" />
            <stop offset="100%" stop-color="#15803D" />
          </linearGradient>
          <linearGradient id="dewGlow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="60%" stop-color="#A7F3D0" />
            <stop offset="100%" stop-color="#34D399" />
          </linearGradient>
        </defs>

        <!-- Ambient Eco Glow -->
        <circle cx="50" cy="50" r="38" fill="#A7F3D0" opacity="0.3" filter="blur(6px)" />

        <!-- 3D Double Helix Rungs and Strand Nodes -->
        <!-- Rung 1 (Top) -->
        <line x1="32" y1="22" x2="68" y2="28" stroke="#34D399" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="32" cy="22" r="5" fill="url(#dnaNodeEmerald)" />
        <circle cx="30.5" cy="20.5" r="1.5" fill="#FFFFFF" />
        <circle cx="68" cy="28" r="4.5" fill="url(#dnaNodeTeal)" />
        <circle cx="67" cy="26.8" r="1.3" fill="#FFFFFF" />

        <!-- Rung 2 -->
        <line x1="42" y1="36" x2="58" y2="39" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" opacity="0.9" />
        <circle cx="42" cy="36" r="4" fill="url(#dnaNodeTeal)" />
        <circle cx="58" cy="39" r="4.5" fill="url(#dnaNodeEmerald)" />

        <!-- Rung 3 (Crossing Center) -->
        <line x1="50" y1="50" x2="50" y2="50" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        <circle cx="50" cy="50" r="5.5" fill="url(#dnaNodeEmerald)" />
        <circle cx="48" cy="48" r="1.8" fill="#FFFFFF" />

        <!-- Rung 4 -->
        <line x1="60" y1="62" x2="40" y2="65" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" opacity="0.9" />
        <circle cx="60" cy="62" r="4.5" fill="url(#dnaNodeTeal)" />
        <circle cx="40" cy="65" r="4" fill="url(#dnaNodeEmerald)" />

        <!-- Rung 5 (Bottom) -->
        <line x1="70" y1="76" x2="30" y2="82" stroke="#34D399" stroke-width="3" stroke-linecap="round" opacity="0.75" />
        <circle cx="70" cy="76" r="5" fill="url(#dnaNodeEmerald)" />
        <circle cx="68.5" cy="74.5" r="1.5" fill="#FFFFFF" />
        <circle cx="30" cy="82" r="4.5" fill="url(#dnaNodeTeal)" />
        <circle cx="28.8" cy="80.8" r="1.3" fill="#FFFFFF" />

        <!-- Sprouting Botanical 3D Leaf with Dewdrop (Foreground Anchor) -->
        <g class="anim-float-leaf" transform="translate(18, 12)">
          <path d="M52 58 C62 48 70 38 68 24 C54 26 44 34 38 48 C43 54 48 57 52 58 Z" fill="url(#leafGrad)" stroke="#15803D" stroke-width="1.5" />
          <path d="M42 45 C48 38 54 32 64 26" stroke="#BBF7D0" stroke-width="1.5" stroke-linecap="round" opacity="0.8" />
          <!-- Glistening Dewdrop on Leaf -->
          <circle cx="56" cy="34" r="3" fill="#FFFFFF" opacity="0.9" />
          <circle cx="55" cy="33" r="1" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  `;
}

export function render3DPolyhedron({ size = 84, className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative; filter: drop-shadow(0 12px 20px rgba(217, 119, 6, 0.25));" aria-hidden="true">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <!-- Facet Gradients for Isometric Polyhedron -->
          <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE68A" />
            <stop offset="60%" stop-color="#F59E0B" />
            <stop offset="100%" stop-color="#D97706" />
          </linearGradient>
          <linearGradient id="facetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24" />
            <stop offset="70%" stop-color="#D97706" />
            <stop offset="100%" stop-color="#B45309" />
          </linearGradient>
          <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F59E0B" />
            <stop offset="70%" stop-color="#B45309" />
            <stop offset="100%" stop-color="#78350F" />
          </linearGradient>
          <linearGradient id="piGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FEF08A" />
            <stop offset="50%" stop-color="#F59E0B" />
            <stop offset="100%" stop-color="#B45309" />
          </linearGradient>
          <linearGradient id="brassCompass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FCD34D" />
            <stop offset="50%" stop-color="#D97706" />
            <stop offset="100%" stop-color="#92400E" />
          </linearGradient>
        </defs>

        <!-- Ambient Warm Glow -->
        <circle cx="48" cy="50" r="38" fill="#FDE68A" opacity="0.35" filter="blur(6px)" />

        <!-- 3D Isometric Icosahedron / Polyhedron Group -->
        <g class="anim-float-poly">
          <!-- Top Triangle Facet -->
          <polygon points="46,18 72,34 32,38" fill="url(#facetTop)" stroke="#FEF3C7" stroke-width="1.2" />
          
          <!-- Center Front Facet (Bright Specular) -->
          <polygon points="32,38 72,34 54,68" fill="url(#facetLeft)" stroke="#FDE68A" stroke-width="1.2" />
          <polygon points="32,38 72,34 54,68" fill="#FFFFFF" opacity="0.12" />

          <!-- Left Lateral Facet -->
          <polygon points="46,18 32,38 18,52" fill="url(#facetRight)" stroke="#F59E0B" stroke-width="1.2" />
          <polygon points="18,52 32,38 54,68" fill="url(#facetLeft)" stroke="#D97706" stroke-width="1.2" />
          
          <!-- Right Lateral Facet -->
          <polygon points="46,18 72,34 82,50" fill="url(#facetTop)" stroke="#FBBF24" stroke-width="1.2" />
          <polygon points="72,34 82,50 54,68" fill="url(#facetRight)" stroke="#B45309" stroke-width="1.2" />

          <!-- Bottom Facet Points -->
          <polygon points="18,52 54,68 36,78" fill="url(#facetRight)" stroke="#92400E" stroke-width="1.2" />
          <polygon points="82,50 54,68 64,76" fill="url(#facetRight)" stroke="#78350F" stroke-width="1.2" />
          <polygon points="54,68 36,78 64,76" fill="url(#facetLeft)" stroke="#92400E" stroke-width="1.2" />

          <!-- Vertex Glint Nodes -->
          <circle cx="46" cy="18" r="2.5" fill="#FFFFFF" />
          <circle cx="32" cy="38" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="72" cy="34" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="54" cy="68" r="2.8" fill="#FFFFFF" />
        </g>

        <!-- Precision Brass Drafting Compass leaning against polyhedron -->
        <g transform="translate(48, 22)">
          <!-- Compass Hinge Sphere -->
          <circle cx="28" cy="18" r="4.5" fill="url(#brassCompass)" stroke="#78350F" stroke-width="1" />
          <circle cx="26.8" cy="16.5" r="1.5" fill="#FFFFFF" />
          <!-- Left Leg -->
          <line x1="28" y1="18" x2="16" y2="58" stroke="url(#brassCompass)" stroke-width="3" stroke-linecap="round" />
          <!-- Right Leg with Needle Point -->
          <line x1="28" y1="18" x2="42" y2="56" stroke="url(#brassCompass)" stroke-width="3" stroke-linecap="round" />
          <polygon points="41,54 44,55 42,62" fill="#475569" />
        </g>

        <!-- Floating Golden Pi (π) Symbol with Specular Shimmer -->
        <g class="anim-float-pi" transform="translate(12, 10)">
          <path d="M12 28 C16 28 28 27.5 32 27.5 M16 28 L14 42 C14 44 13 45 10 45 M26 28 L28 42 C28 45 30 46 34 45.5" stroke="url(#piGold)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 4px 6px rgba(180, 83, 9, 0.4))" />
          <circle cx="12" cy="27.5" r="1.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  `;
}

export function render3DAvatar({ size = 72, name = 'Aarav Sharma', className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-avatar-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative;" aria-label="${name} 3D Avatar">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <radialGradient id="skinGlow" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stop-color="#FED7AA" />
            <stop offset="60%" stop-color="#FDBA74" />
            <stop offset="90%" stop-color="#FB923C" />
            <stop offset="100%" stop-color="#EA580C" />
          </radialGradient>
          <radialGradient id="hairGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="50%" stop-color="#1E293B" />
            <stop offset="100%" stop-color="#0F172A" />
          </radialGradient>
          <linearGradient id="jacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6" />
            <stop offset="50%" stop-color="#2563EB" />
            <stop offset="100%" stop-color="#1D4ED8" />
          </linearGradient>
          <linearGradient id="badgeStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDE047" />
            <stop offset="100%" stop-color="#EAB308" />
          </linearGradient>
        </defs>

        <!-- Ambient Backdrop Circle -->
        <circle cx="50" cy="50" r="46" fill="rgba(37, 99, 235, 0.12)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="2" />

        <!-- 3D Clay Hair Backing -->
        <ellipse cx="50" cy="42" rx="26" ry="24" fill="url(#hairGrad)" />

        <!-- Neck -->
        <rect x="44" y="60" width="12" height="12" rx="4" fill="#FB923C" />

        <!-- 3D Clay Face Sphere -->
        <circle cx="50" cy="48" r="22" fill="url(#skinGlow)" />
        <ellipse cx="44" cy="42" rx="6" ry="3.5" fill="#FFFFFF" opacity="0.3" />

        <!-- Hair Front Tuft (Modern Stylized Clay) -->
        <path d="M26 40 C28 26 40 20 54 22 C64 24 72 32 74 42 C70 34 60 30 50 32 C38 34 32 38 26 40 Z" fill="url(#hairGrad)" />
        <ellipse cx="42" cy="26" rx="8" ry="3" fill="#64748B" opacity="0.4" />

        <!-- Friendly Expressive Eyes with Catchlights -->
        <ellipse cx="42" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
        <circle cx="43" cy="46.5" r="1.5" fill="#FFFFFF" />
        <ellipse cx="58" cy="48" rx="3.5" ry="4.5" fill="#0F172A" />
        <circle cx="59" cy="46.5" r="1.5" fill="#FFFFFF" />

        <!-- Cheeks (Blushing Rosy Tone) -->
        <circle cx="36" cy="54" r="3.5" fill="#F43F5E" opacity="0.3" />
        <circle cx="64" cy="54" r="3.5" fill="#F43F5E" opacity="0.3" />

        <!-- Confident Warm Smile -->
        <path d="M43 56 C46 60 54 60 57 56" stroke="#9A3412" stroke-width="2.5" stroke-linecap="round" fill="none" />

        <!-- School Uniform Collar & Blue Jacket -->
        <path d="M22 88 C24 74 36 70 50 70 C64 70 76 74 78 88 Z" fill="url(#jacketGrad)" />
        <polygon points="50,70 43,82 50,86 57,82" fill="#FFFFFF" />
        <polygon points="48,82 52,82 51,90 49,90" fill="#EF4444" />

        <!-- Scholar Gold Star Pin on Lapel -->
        <g transform="translate(62, 75) scale(0.65)">
          <polygon points="10,1 13,7 19,8 15,13 16,19 10,16 4,19 5,13 1,8 7,7" fill="url(#badgeStarGrad)" stroke="#CA8A04" stroke-width="1" />
        </g>
      </svg>
    </div>
  `;
}

export function render3DStudyBuddy({ size = 56, className = '' } = {}) {
  const s = size;
  return `
    <div class="art-3d-buddy-wrapper ${className}" style="width: ${s}px; height: ${s}px; display: inline-flex; align-items: center; justify-content: center; position: relative;" aria-label="3D AI Study Buddy">
      <svg width="${s}" height="${s}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="art-3d-svg">
        <defs>
          <radialGradient id="buddyBody" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="50%" stop-color="#EEF2FF" />
            <stop offset="85%" stop-color="#C7D2FE" />
            <stop offset="100%" stop-color="#818CF8" />
          </radialGradient>
          <linearGradient id="visorScreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" />
            <stop offset="100%" stop-color="#1E1B4B" />
          </linearGradient>
          <linearGradient id="antennaGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#67E8F9" />
            <stop offset="100%" stop-color="#06B6D4" />
          </linearGradient>
        </defs>

        <!-- Zero-G Ambient Float Halo -->
        <circle cx="50" cy="50" r="44" fill="#818CF8" opacity="0.25" filter="blur(8px)" />

        <!-- Floating Robot Antenna -->
        <line x1="50" y1="24" x2="50" y2="14" stroke="#818CF8" stroke-width="3" stroke-linecap="round" />
        <circle cx="50" cy="12" r="5" fill="url(#antennaGlow)" />
        <circle cx="48.5" cy="10.5" r="1.5" fill="#FFFFFF" />

        <!-- Left & Right Ear Pods -->
        <rect x="14" y="44" width="8" height="18" rx="4" fill="#6366F1" />
        <rect x="78" y="44" width="8" height="18" rx="4" fill="#6366F1" />

        <!-- 3D Glossy Ceramic Robot Head -->
        <rect x="20" y="24" width="60" height="54" rx="22" fill="url(#buddyBody)" stroke="#FFFFFF" stroke-width="2" />
        <ellipse cx="42" cy="30" rx="14" ry="4" fill="#FFFFFF" opacity="0.6" />

        <!-- Curved Dark Visor Screen -->
        <rect x="28" y="38" width="44" height="26" rx="10" fill="url(#visorScreen)" stroke="#4338CA" stroke-width="1.5" />

        <!-- Expressive Glowing Cyan OLED Eyes -->
        <g class="anim-buddy-eyes">
          <ellipse cx="40" cy="50" rx="4.5" ry="6" fill="#22D3EE" filter="drop-shadow(0 0 4px #06B6D4)" />
          <circle cx="38.5" cy="48" r="1.8" fill="#FFFFFF" />
          <ellipse cx="60" cy="50" rx="4.5" ry="6" fill="#22D3EE" filter="drop-shadow(0 0 4px #06B6D4)" />
          <circle cx="58.5" cy="48" r="1.8" fill="#FFFFFF" />
        </g>

        <!-- Happy Robotic Digital Cheeks -->
        <line x1="33" y1="56" x2="36" y2="56" stroke="#34D399" stroke-width="2" stroke-linecap="round" />
        <line x1="64" y1="56" x2="67" y2="56" stroke="#34D399" stroke-width="2" stroke-linecap="round" />
      </svg>
    </div>
  `;
}

