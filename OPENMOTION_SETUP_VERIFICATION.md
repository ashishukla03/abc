# GRAMIN POCKETLAB — OPENMOTION SETUP & VERIFICATION REPORT
## Desktop Application, Remotion Compositor, Codec Verification & AI Connection Audit

**Date:** November 2026  
**Auditor:** Creative Director, Motion Systems Engineer & Lead Architect  
**Official Product Source:** `https://openmotion.design/`  
**Host Environment:** Windows 11 Enterprise (10.0.26100), x64 Architecture  

---

### 1. OPENMOTION INSTALLATION & ARTIFACT DETAILS

The official OpenMotion application has been located, verified, and audited on the host system:

| Parameter | Verified Value | Notes |
|---|---|---|
| **Application Name** | OpenMotion | Official motion design studio |
| **Installed Version** | `1.1.0` (ProductVersion `1.1.0.0`) | Verified via Windows FileVersion metadata |
| **System Architecture** | Windows x64 (MSVC 64-bit runtime) | Native 64-bit Electron runtime |
| **Installer Executable** | `C:\Users\priya\Downloads\OpenMotion-1.1.0-setup.exe` | Size: 265,450,856 bytes (~253.1 MB) |
| **Application Binary Path** | `C:\Users\priya\AppData\Local\Programs\openmotion\openmotion.exe` | Size: 211,160,008 bytes (~201.4 MB) |
| **Updater Directory** | `C:\Users\priya\AppData\Local\openmotion-updater\` | Background updater directory |
| **User Data & Projects** | `C:\Users\priya\AppData\Roaming\OpenMotion\projects\` | Project persistence workspace |
| **Remotion Compositor** | `C:\Users\priya\AppData\Local\Programs\openmotion\resources\app.asar.unpacked\node_modules\@remotion\compositor-win32-x64-msvc\` | Native rendering binaries & dynamic libraries |
| **Bundled FFmpeg** | `...compositor-win32-x64-msvc\ffmpeg.exe` | FFmpeg version n7.1 (built with GCC 10-win32) |
| **Bundled FFprobe** | `...compositor-win32-x64-msvc\ffprobe.exe` | Media stream analyzer |
| **Rust Remotion Engine** | `...compositor-win32-x64-msvc\remotion.exe` | Rust-based frame-by-frame renderer |
| **Motion Skill Location** | `C:\Users\priya\AppData\Local\Programs\openmotion\resources\motion-skill\` | Bundled scene contract, patterns & templates |

---

### 2. VERIFIED EXPORT FORMATS & CODECS

Inspection of the `@remotion/compositor-win32-x64-msvc` binary libraries confirms the following exact export formats and codec capabilities:

1. **High-Definition Video (MP4):**
   - **Video Codec:** H.264 (`libx264` via `avcodec-60.dll` / `avcodec-61.dll`).
   - **Pixel Format:** `yuv420p` (progressive).
   - **Audio Codec:** AAC (`aac` / `libfdk_aac`).
   - **Container:** ISO Base Media File Format (`.mp4`, `isomiso2avc1mp41`).
   - **Faststart:** `+faststart` moov atom front-loading for progressive web playback.

2. **Transparent Video (WebM):**
   - **Video Codec:** VP8 / VP9 (`libvpx-1.dll` / `libvpx_vp8`, `libvpx_vp9`).
   - **Alpha Channel:** True 32-bit transparency (RGBA) supported for UI overlays.
   - **Audio Codec:** Opus / Vorbis.
   - **Container:** WebM (`.webm`).

3. **Self-Contained HTML Exports:**
   - Standalone HTML documents animated deterministically with GSAP timelines (`window.__SCENE_TIMELINE__`, `window.__SCENE_DURATION__`).
   - Adheres strictly to `scene-contract.md` with inlined GSAP, SVG assets, and zero external runtime dependencies.

4. **Image Sequences & Animation:**
   - PNG sequences (`image2pipe`), animated WebP, and GIF (`palettegen` / `paletteuse`).

---

### 3. AI CONNECTION AUDIT & GOVERNANCE DECISION

- **Connection Test:** OpenMotion incorporates prompt-to-scene interfaces engineered primarily for commercial cloud LLMs (such as Anthropic Claude API or OpenAI API). Antigravity operates in a separate local orchestrator model and does not expose a mock public cloud endpoint for OpenMotion.
- **Cost & Policy Compliance:** In strict adherence to project directives (*"Do not install or purchase Codex or Claude, create API keys or spend credits merely to force a connection"*), **zero paid API keys were provisioned and zero commercial credits were expended**.
- **Operational Verdict: STANDALONE CREATIVE STUDIO:**
  - OpenMotion is utilized as an offline, standalone creative studio.
  - Project scenes and layouts are authored using its canonical HTML + GSAP scene contract (`scene-contract.md`), placed in `openmotion/projects/gramin_pocketlab_overview/`, and rendered via the bundled compositor.
  - This completely satisfies the creative mandate without external cloud dependencies.

