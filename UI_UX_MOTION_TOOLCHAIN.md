# Gramin PocketLab: UI/UX & Motion Toolchain Specification

**Product:** Gramin PocketLab (Classes 5–12 All-Subject Learning Ecosystem)  
**Author:** Principal Product Architect & Motion Systems Engineer  
**Date:** November 2026  
**Status:** COMPLETE / GOVERNANCE APPROVED  

---

## 1. Context & Architecture Mandate

Gramin PocketLab delivers an immersive, interactive learning experience across Classes 5–12 for students throughout India. A critical design constraint is hardware equity: the platform must achieve buttery 60fps animations, instant responsiveness (<100ms user input latency), and rapid cold launch (<1.8s) on entry-level Android devices (2 GB RAM, Quad-core 2.0 GHz CPUs, Mali-G52 / Adreno 506 GPUs) while functioning completely offline.

This specification evaluates candidate motion tools, audits the `ai-ui-ux-motion-engine` skill, and formalizes a minimal, robust, zero-dependency motion toolchain.

---

## 2. Evaluation of External Candidate: `ai-ui-ux-motion-engine`

### 2.1. Tool Identity & Provenance
* **Repository:** `https://github.com/OpaceDigitalAgency/ai-ui-ux-motion-engine`
* **Version:** 1.7.0
* **License:** MIT License (Permissive open source)
* **Author / Maintainer:** Opace Digital Agency
* **Type:** Agent Skill (Anthropic Claude Code, Cursor, Codex, Google Antigravity compatible)

### 2.2. Security Audit of Installer Scripts
The repository provides two automated installation scripts: `install-skill.sh` (POSIX/Bash) and `install-skill.ps1` (PowerShell).
* **Script Inspection Findings:**
  * Both scripts attempt to clone or copy skill files directly into global user directories (`~/.claude/skills/`, `~/.cursor/rules/`, or `%USERPROFILE%\.gemini\antigravity\skills`).
  * `install-skill.ps1` checks for execution policy bypasses and downloads remote assets via `Invoke-WebRequest`.
* **Security & Governance Assessment:**
  * **Violation of Isolation:** Executing third-party PowerShell or Bash installers runs counter to Antigravity Task v7 Part 10 rules ("No uninspected desktop binaries or unreviewed installer scripts").
  * **Global Mutation Risk:** Global skill installation pollutes the parent agent runtime across unrelated projects.
* **Governed Recommendation:**
  * **Do NOT execute installer scripts.**
  * Ingest the core motion principles and design token tables manually or as an isolated, project-local skill reference file under `.agents/skills/ai-ui-ux-motion-engine/SKILL.md` strictly audited for safe Markdown content with zero executable binary hooks.

### 2.3. Runtime Library Evaluation (GSAP, Framer Motion, Three.js)
The `ai-ui-ux-motion-engine` heavily promotes external commercial/heavy libraries:
* **GreenSock Animation Platform (GSAP):** Robust timeline capabilities, but adds 65 KB minified JS. While licensed under Standard 'No-Charge' GreenSock license, commercial/enterprise redistribution with paywalled features carries license restrictions.
* **Framer Motion:** Excellent declarative API for React, but Gramin PocketLab's Phase 1 foundation is zero-dependency vanilla TypeScript/HTML5 to guarantee sub-1.8s cold launch on 2 GB RAM. Introducing React + Framer Motion adds >150 KB runtime JS.
* **Three.js (WebGL):** 600 KB+ bundle size and high WebGL context GPU VRAM overhead (>120 MB RAM allocation per scene). Fatal on 2 GB RAM devices where Android Low Memory Killer (LMK) terminates background apps.

---

## 3. Comprehensive Toolchain Comparison & Decision Matrix

| Dimension | Native CSS (Transitions / Keyframes) | Web Animations API (WAAPI) | Native SVG + Canvas 2D | Heavy External (GSAP / Three.js) | OpenMotion (Web Export) | AI UI/UX Motion Engine |
|---|---|---|---|---|---|---|
| **Bundle Size Overhead** | **0 KB** | **0 KB** | **0 KB** | 65 KB – 600 KB+ | 45 KB – 150 KB | 0 KB (Skill only) |
| **Compositor Acceleration** | Full (GPU thread) | Full (GPU thread) | Canvas partial (GPU) | Main thread dependent | Mixed | Prescribes external libs |
| **2 GB RAM Performance** | 60 fps constant | 60 fps constant | 60 fps (bounded buffer) | High jank / OOM risk | High memory footprint | N/A (Guidance only) |
| **Two-Way State Reactivity** | Native DOM hooks | Full JavaScript control | Full Canvas script control | High | None (Canned playback) | High |
| **Accessibility Hooks** | Automatic CSS overrides | JS-aware cancellation | ARIA canvas wrapper | Manual implementation | Poor / Non-semantic | Excellent guidelines |
| **Offline Reliability** | 100% native | 100% native | 100% native | Requires local bundle | Canned video/DOM | 100% (local prompt) |
| **Architectural Verdict** | **TIER 1 FOUNDATION** | **TIER 1 INTERACTION** | **TIER 2 SIMULATION** | **REJECTED FOR CORE** | **MARKETING ASSETS ONLY** | **DESIGN GUIDELINE ONLY** |

---

## 4. Gramin PocketLab Minimal Governed Motion Toolchain

To enforce strict hardware equity, zero license encumbrance, and peak performance, Gramin PocketLab adopts a four-tier architecture:

```
+-----------------------------------------------------------------------------------+
|                        GRAMIN POCKETLAB MOTION TOOLCHAIN                          |
+-----------------------------------------------------------------------------------+
|  TIER 1: CORE UI & MICRO-INTERACTIONS (0 KB Overhead)                             |
|  - CSS Variables & Design Tokens (tokens.css)                                     |
|  - CSS Transitions: transform, opacity, color (Hardware Composited)              |
|  - CSS Keyframes: Loading spinners, subtle badge pulses, sheet slides             |
|  - Web Animations API (WAAPI): Dynamic coordinate interpolations, gestures        |
+-----------------------------------------------------------------------------------+
|  TIER 2: INTERACTIVE QUESTIONWORLDS & SIMULATIONS (0 KB Overhead)                |
|  - Vector SVG: Scalable diagrams, glassware, anatomical overlays, circuit paths   |
|  - Canvas 2D API: Procedural wave plotting (Physics 220/440Hz), particle fields   |
|  - Sandboxed execution: Opaque <iframe> with postMessage contract                |
+-----------------------------------------------------------------------------------+
|  TIER 3: ACCESSIBILITY & SAFETY GOVERNANCE (Mandatory Enforcement)                 |
|  - prefers-reduced-motion media query: duration collapsed to 0.001ms              |
|  - High-contrast visual focus indicators (3px solid #1A73E8)                     |
|  - Photophobic / Seizure safety: Zero flashing frequencies between 3 Hz and 50 Hz |
+-----------------------------------------------------------------------------------+
|  TIER 4: EXTERNAL EXPLORATION & MARKETING (Offline Workstation Only)               |
|  - OpenMotion: Standalone concept teasers, video exports (MP4/WebM)               |
|  - ai-ui-ux-motion-engine: Prompt engineering reference for bezier curve design   |
+-----------------------------------------------------------------------------------+
```

---

## 5. Standardized Motion Tokens & Curves

All animations must derive strictly from the following CSS custom properties defined in the Design System:

```css
:root {
  /* Duration Tokens */
  --motion-duration-instant: 100ms;   /* Button clicks, toggle switches */
  --motion-duration-fast:    180ms;   /* Dropdown menus, tooltips */
  --motion-duration-normal:  280ms;   /* Card expansions, tab switching */
  --motion-duration-slow:    400ms;   /* Modal entries, sheet drawer slides */
  --motion-duration-hero:    600ms;   /* QuestionWorld stage entry */

  /* Easing Curves (Cubic Bezier) */
  --motion-ease-standard:   cubic-bezier(0.2, 0.0, 0.0, 1.0); /* Material 3 Standard / Emphasized */
  --motion-ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1.0); /* Entering elements */
  --motion-ease-accelerate: cubic-bezier(0.4, 0.0, 1.0, 1.0); /* Exiting elements */
  --motion-ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1.0); /* Playful micro-rewards (Class 5 only) */
}

/* Reduced Motion Override - Absolute Platform Law */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 6. Implementation Checklist & Enforcement
1. **Zero External Runtime JS:** No NPM motion packages (`gsap`, `framer-motion`, `lottie-web`) in `package.json` runtime dependencies.
2. **GPU Compositor Only:** Animations must touch only `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
3. **Frame Budget:** 16.6ms per frame. Dropped frames must be measured during automated Playwright audits.

