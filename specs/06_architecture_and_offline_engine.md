# Technical Architecture & Offline Engine Proposal — Gramin PocketLab

**Document ID:** SPEC-ARCH-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Status:** Pre-Event Specification  

---

## 1. Architectural Philosophy & Zero-Dependency Model

To ensure 100% operational reliability on budget Android phones in rural environments, Gramin PocketLab operates under strict engineering constraints:
1. **Single Client-Side Web Application:** Built with HTML5, Vanilla JavaScript or lightweight React/Preact, and Vanilla CSS.
2. **Zero Runtime Server Dependency:** No API calls, no cloud databases, no external font/script CDNs. All assets (HTML, CSS, JS, SVG icons, audio soundbanks) are packaged locally.
3. **Local State Persistence:** State lives entirely within `localStorage` (structured JSON).
4. **Offline First (PWA):** A deterministic Cache-First Service Worker caches all critical bundle files on the first network load. Subsequent launches run seamlessly in Airplane Mode.

---

## 2. System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                            BROWSER RUNTIME (Client-Only)                         |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           Presentation & Shell Layer                        |  |
|  |  [ Global Header ] [ Subject Switcher ] [ Step Stepper ] [ Sticky Action ]  |  |
|  +---------------------------------------+-------------------------------------+  |
|                                          |                                        |
|                                          v                                        |
|  +-----------------------------------------------------------------------------+  |
|  |                       Shared Learning Engine (Lifecycle)                    |  |
|  |    Intro -> Predict -> Explore -> Explain -> Feedback/Retry -> Exit -> Result  |  |
|  +----+------------------+------------------+-------------------+--------------+  |
|       |                  |                  |                   |                 |
|       v                  v                  v                   v                 |
|  +----------+     +--------------+    +------------+     +---------------------+  |
|  | Math     |     | Biology      |    | Chemistry  |     | Physics             |  |
|  | Water    |     | Food Web     |    | pH Color   |     | Sound Detective     |  |
|  | Lab      |     | Simulator    |    | Lab        |     | (Web Audio + Canvas)|  |
|  +----------+     +--------------+    +------------+     +----------+----------+  |
|       |                  |                  |                       |             |
|       +------------------+------------------+-----------------------+             |
|                                          |                                        |
|                                          v                                        |
|  +-----------------------------------------------------------------------------+  |
|  |                         Client Infrastructure Layer                         |  |
|  |                                                                             |  |
|  |  +-------------------+  +--------------------+  +------------------------+  |  |
|  |  | LocalStorage Sync |  | Web Audio Engine   |  | Service Worker Cache   |  |  |
|  |  | (Anonymous State) |  | (Synthetic Synth)  |  | (Offline CacheStorage) |  |  |
|  |  +-------------------+  +--------------------+  +------------------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Flagship Audio & Physics Pipeline (Safe Web Audio)

The Physics mission ("Sound Detective") relies on real-time browser audio APIs:

### 3.1 Synthetic Tone Generation
* Uses `window.AudioContext || window.webkitAudioContext`.
* Audio Graph:
  ```
  OscillatorNode (type: 'sine', freq: 220Hz / 440Hz)
        │
        ▼
  GainNode (volume clamp: max 0.85 to prevent speaker clipping)
        │
        ▼
  AnalyserNode (fftSize: 2048, time-domain waveform export)
        │
        ▼
  AudioContext.destination (Device Speaker / Headphones)
  ```
* **Autoplay Safety:** `AudioContext` is instantiated in `'suspended'` state. It is resumed strictly in response to an explicit user touch or click event (`button.onclick = () => ctx.resume()`), satisfying mobile browser security requirements.

### 3.2 Optional Microphone Input Architecture
* Microphones on student phones can be noisy or blocked. The application treats microphone access as a **progressive enhancement**:
  1. User clicks `[ 🎙 Test Live Sound ]`.
  2. Browser requests `navigator.mediaDevices.getUserMedia({ audio: true })`.
  3. If granted: Routes mic input through `AnalyserNode` for live time-domain canvas plotting.
  4. If denied or unsupported: Displays non-intrusive notification: `"Microphone optional. You can explore all sounds using the built-in tone generator."`
  5. **Privacy Assurance:** Live microphone data is processed purely in volatile memory inside the `AnalyserNode`. Zero audio streams or audio files are recorded, serialized, or stored.

---

## 4. Service Worker Caching Strategy (Offline First)

```javascript
// service-worker.js (Proposed Architecture)
const CACHE_NAME = 'pocketlab-cache-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './manifest.json',
  './assets/icons.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached asset immediately; fall back to network if absent
      return cachedResponse || fetch(event.request);
    })
  );
});
```

---

## 5. Security, Child Privacy & Hackathon Integrity Boundaries

1. **Data Protection & Privacy Architecture (DPDP Act 2023, India):**
   * *Note: Formal legal compliance under the DPDP Act 2023 has not been assessed by legal counsel. The following reflect factual engineering choices:*
   * The application collects **zero student identifiers** (no names, phone numbers, or emails).
   * Local progress is stored anonymously in `localStorage` under a single session. Multi-child profile switching UI (`profile_1` / `profile_2`) is deferred from MVP.
   * No cookies, analytics trackers, or fingerprinting scripts are bundled.
2. **Audio Safeguards & Transducer Headroom:**
   * Maximum digital gain output is clamped to $-3\text{ dBFS}$ ($0.70$ linear scale) to prevent digital clipping distortion on budget mobile DACs. (A digital gain cap does not guarantee biological hearing safety or prevent physical speaker damage at elevated device master volumes).
   * Mandatory behavioral safeguards include: default low initial volume ($20\%–30\%$), strict user-initiated playback (zero autoplay), persistent stop/mute controls, and a practical actual-device audio playback test plan (testing playback start, user-controlled volume, stop/mute controls, and absence of distortion; without claiming calibrated SPL or guaranteed hearing safety) prior to demonstration.
