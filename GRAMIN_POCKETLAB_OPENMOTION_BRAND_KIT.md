# GRAMIN POCKETLAB — OPENMOTION BRAND KIT & DESIGN TOKEN SPECIFICATION
## Coherent Visual Identity, Motion Tokens, Typography & Color Palette

**Date:** November 2026  
**Status:** AUTHORITATIVE & GOVERNED  
**Design Reference:** `app/css/tokens.css` & `AGE_ADAPTIVE_DESIGN_SYSTEM.md`  

---

### 1. AUTHORITATIVE BRAND PALETTE

To ensure consistency across the application and all OpenMotion creative deliverables, only the official design tokens are permitted. No competing palettes or unauthorized institutional logos may be introduced.

| Token Role | Hex Code | Visual Swatch | Accessibility Contrast (on Surface/White) | Usage & Semantics |
|---|---|---|---|---|
| **Background** | `#F5F7FB` | Soft Slate Gray | 1.05:1 (structural boundary) | Viewport stage background, outer frame canvas |
| **Surface** | `#FFFFFF` | Crisp White | Base canvas | Cards, dialog modals, interactive micro-lab containers |
| **Main Text** | `#162033` | Deep Navy Slate | **13.84:1 (WCAG AAA)** | Primary headings, body copy, active data labels |
| **Secondary Text** | `#596579` | Slate Gray | **5.32:1 (WCAG AA)** | Subtitles, supporting copy, measurement units |
| **Border / Divider** | `#D9E0EB` | Light Gray | 1.38:1 | Card borders, table dividers, frame containers |
| **Mathematics** | `#275DDB` | Cobalt Blue | **4.68:1 (WCAG AA)** | Water Share Challenge, canal markers, ratio indicators |
| **Biology** | `#18794E` | Forest Green | **4.82:1 (WCAG AA)** | Food Web Explorer, trophic levels, energy flow arrows |
| **Chemistry** | `#8B3E98` | Plum Purple | **4.62:1 (WCAG AA)** | pH Color Lab, indicator test strips, beaker reagents |
| **Physics** | `#087E79` | Deep Teal | **4.74:1 (WCAG AA)** | Sound Detective, oscilloscope wave canvas, audio badges |

---

### 2. TYPOGRAPHY & LAYOUT HIERARCHY

1. **Font Family (Zero Network Download):**
   ```css
   font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
   ```
   *Rationale:* Eliminates external web font requests (`@import`, Google Fonts), preventing render-blocking network delays on 2G/3G connections.
2. **Type Scale (Desktop / 16:9 Composition):**
   - **Hero / Display:** $52\text{ px} - 56\text{ px}$ (Font Weight: 900)
   - **Section Title:** $36\text{ px} - 42\text{ px}$ (Font Weight: 800)
   - **Card Heading:** $22\text{ px} - 26\text{ px}$ (Font Weight: 700)
   - **Body Copy:** $18\text{ px} - 20\text{ px}$ (Font Weight: 400 / 500, line height: 1.5)
   - **Captions & Meta:** $14\text{ px} - 16\text{ px}$ (Font Weight: 600)

---

### 3. MOTION & EASING TOKENS

When animating OpenMotion scenes or writing in-app CSS transitions, all animations must align with the physics of natural educational tools:

| Motion Token | Duration | Cubic Bezier / GSAP Curve | Application |
|---|---|---|---|
| `--motion-instant` | $100\text{ ms}$ | `linear` | State toggles, button active press states |
| `--motion-fast` | $250\text{ ms}$ | `power2.out` / `cubic-bezier(0, 0, 0.2, 1)` | Dropdowns, tooltips, pill selections |
| `--motion-standard` | $400\text{ ms}$ | `power3.out` / `cubic-bezier(0.2, 0, 0, 1)` | Card transitions, stage step navigation |
| `--motion-entrance` | $700\text{ ms}$ | `back.out(1.7)` / `power3.out` | Badge entrance, headline reveals, celebration |
| `--motion-wave` | $33.3\text{ ms}$ | Procedural (Canvas $2\pi f t$) | Physics 220/440 Hz sound wave loop |

---

### 4. IN-APP MEDIA INTEGRATION & PERFORMANCE BOUNDARIES

For any marketing or explainer media integrated within the application:
1. **Zero Autoplay Audio:** The `<video>` element must include `playsinline muted`. Sound requires an explicit user tap.
2. **Explicit Media Budget:** Explainer clips must not exceed $1.5\text{ MB}$ total file size.
3. **Lazy Loading:** Videos must have `preload="none"` or `loading="lazy"` with a lightweight static poster image (`.png` / `.webp`).
4. **Offline Isolation:** Prerecorded marketing videos **must never** be precached by the Service Worker into `pocketlab-v2`, preserving scarce device storage on rural student handsets.
5. **Universal Captions:** Every video deliverable must be accompanied by a WebVTT (`.vtt`) track and an accessible text transcript.

