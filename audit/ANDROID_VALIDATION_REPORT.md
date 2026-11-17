# PHYSICAL ANDROID VALIDATION REPORT — GRAMIN POCKETLAB

**Document ID:** ANDROID-VERIFY-2026-001  
**Target Platform:** Low-End Android Smartphone (Target Reference: Xiaomi Redmi 9A / Realme C-series, $360\text{px} \times 640\text{px}$ Viewport, Android 10+)  
**Hardware Status:** **NOT TESTED ON PHYSICAL HARDWARE**  
**Emulation Status:** VERIFIED VIA CHROME DEVTOOLS PROTOCOL (Mobile Viewport & User Gesture Emulation)  
**Date:** November 9, 2026

---

## 1. Explicit Hardware Disclosure

> [!IMPORTANT]
> **No physical Android smartphone hardware was connected to the development environment during this release cycle.**
> Claims of verified audio latency, tactile hardware touch responsiveness, physical speaker blowout thresholds, or OS-level Android audio focus policies cannot be honestly validated without a physical device tethered via ADB or Chrome remote device inspection. Consequently, physical Android hardware testing is explicitly recorded as **NOT TESTED**.

---

## 2. Emulated Android Mobile Viewport Verification ($360\text{px} \times 640\text{px}$)

Using Chrome DevTools Protocol (`Emulation.setDeviceMetricsOverride`), the application was evaluated against the typical low-end Indian rural smartphone profile:
- **Viewport Width:** $360\text{px}$
- **Viewport Height:** $640\text{px}$
- **Device Pixel Ratio (DPR):** $2.0$
- **Touch Emulation:** Enabled

### Results of Emulated Verification:

1. **Touch Target Dimensions ($\ge 48\text{px} \times 48\text{px}$):**
   - All interactive controls (`.btn`, `.btn-select-subject`, `.preset-btn`, `.radio-card`, stepper buttons) satisfy the WCAG 2.5.5 touch target minimum of $48\text{px}$ height.
2. **Horizontal Scrolling / Layout Budget:**
   - **Initial Finding:** Detected a 12px overflow (`scrollWidth: 372px`) on a $360\text{px}$ viewport caused by `.header-inner` containing the brand title, network pill, and utility buttons without flex wrapping.
   - **Remediation:** Added `@media (max-width: 480px)` rule in `app/css/main.css` ([line 186](file:///c:/Users/priya/Downloads/STEM/app/css/main.css#L186)) hiding the header status pill on small viewports and reducing horizontal padding to $8\text{px}$.
   - **Post-Fix Measurement:** `document.documentElement.scrollWidth` measures exactly $360\text{px}$ ($0\text{px}$ overflow).
3. **Canvas 2D Retina / High-DPI Rendering:**
   - The oscilloscope canvas (`#phys-oscilloscope-canvas`) automatically scales its internal bitmap by `window.devicePixelRatio = 2.0` ($1200\times 480$ buffer displayed at $100\% \times 240\text{px}$), maintaining crisp wave lines on high-density mobile screens.
4. **Android Autoplay & Web Audio Gesture Policy:**
   - Android Chrome strictly forbids Web Audio generation prior to an explicit user touch gesture. In `app/modules/physics.js`, `AudioContext` is created in the suspended state and resumes only inside the `click` handler for `#phys-play-btn`, `#phys-preset-220`, or `#phys-preset-440`.

---

## 3. Required Pre-Deployment Hardware Checklist

Before deploying Gramin PocketLab to physical rural schools or field tablets, the following real-device verification steps must be completed on actual hardware:

| Step | Description | Verification Method | Status |
| :---: | :--- | :--- | :---: |
| **1** | Chrome / Android Browser installation & Add to Home Screen (PWA install prompt) | Tap browser menu $\rightarrow$ "Install App" | **PENDING HARDWARE** |
| **2** | Hardware Speaker Volume & Distortion Check across 220 Hz and 440 Hz tones | Listen for speaker rattle on low-cost phone speakers | **PENDING HARDWARE** |
| **3** | Tactile Slider Drag Responsiveness on low-refresh-rate (60Hz) touchscreens | Drag frequency slider across 100 Hz to 800 Hz range | **PENDING HARDWARE** |
| **4** | Android Background Audio Interruption (Phone Call / Alarm) | Trigger incoming call while tone is playing | **PENDING HARDWARE** |
| **5** | Low Memory (RAM $\le 2\text{GB}$) Stability under continuous canvas drawing | Monitor Android OS LMK (Low Memory Killer) logs | **PENDING HARDWARE** |

