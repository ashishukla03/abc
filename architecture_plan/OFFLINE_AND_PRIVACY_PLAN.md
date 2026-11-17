# OFFLINE ARCHITECTURE, CACHING STRATEGY & PRIVACY PLAN

**Document ID:** ARCH-OFFLINE-PRIVACY-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Senior Front-End Architect & Privacy Auditor  
**Data Privacy Stance:** Factual Data-Handling Architecture (Formal legal compliance under DPDP Act 2023 not assessed)  

---

## 1. Truthful Offline Capability Framework

### 1.1 The First-Visit Reality
* **Technical Invariant:** A web application cannot operate offline on a device that has never previously accessed the application assets over a network.
* **Accurate Framing:** Gramin PocketLab is an **Offline-First Progressive Web App (PWA)** designed to download and cache its static bundle (<2MB engineering target) on the **first successful network connection**. Subsequent launches operate offline from ServiceWorker cache. It is acknowledged that browser cache eviction, manual cache clearing, or storage pressure will require network reconnection to re-populate the cache.
* **Judge Presentation Strategy:** The team will pre-cache the application on demonstration smartphones before walking up to the judging table.

---

## 2. Service Worker Caching Architecture

The application implements a deterministic **Cache-First (Stale-While-Revalidate with Pre-Caching)** Service Worker lifecycle:

```
[ Browser Navigation / Asset Fetch ]
                 │
                 ▼
      [ Service Worker Fetch Handler ]
                 │
      +----------+----------+
      │ (Match Found in Cache)
      ▼
[ Return Cached Asset (Immediate Local Cache) ]
      │
      ▼ (Background Asynchronous Revalidate)
[ Network Fetch Update ] ---> Update Cache for Next Visit

      +----------+----------+
      │ (Cache Miss - E.g. First Load)
      ▼
[ Network Fetch Request ]
      │
      ▼
[ Write to CacheStorage ('pocketlab-v2') ]
      │
      ▼
[ Return Response to Client ]
```

### 2.1 Cache Asset Manifest
```javascript
const CACHE_NAME = 'gramin-pocketlab-v2.0';
const CRITICAL_ASSETS = [
  './',
  './index.html',
  './index.css',
  './app.js',
  './manifest.json',
  './assets/icons.svg',
  './content/i18n.json'
];
```

### 2.2 Error Presentation on Cache Failure
* If the user is on their first visit, has no network, and attempts to load an un-cached route, the browser natively displays its network error.
* If a network update fails during a background revalidate, the application ignores the network failure silently and continues running from the local cache, preventing UI interruption.

---

## 3. Local Storage Failure & Quota Fallback Plan

* **Storage Substrate:** `window.localStorage` (storing JSON stringified learner state under key `pocketlab_state_v1`).
* **Storage Footprint:** Less than **$50\text{ KB}$** total storage consumption (well below the $5\text{ MB}$ mobile quota limit).
* **Failure Modes & Fallbacks:**
  1. **Private Browsing / Incognito Blocking:** In some restricted browsers, writing to `localStorage` throws a `QuotaExceededError` or `SecurityError`.
  2. **Graceful In-Memory Fallback:** The storage manager wraps all read/write operations in a `try/catch` block. If `localStorage` access is rejected, the manager automatically switches to a volatile in-memory JavaScript object fallback:
     ```javascript
     class SafeStorageManager {
       constructor() {
         this.memoryFallback = {};
         this.isStorageAvailable = this.checkStorage();
       }
       setItem(key, val) {
         if (this.isStorageAvailable) {
           try { localStorage.setItem(key, val); return; } catch (e) {}
         }
         this.memoryFallback[key] = val;
       }
       getItem(key) {
         if (this.isStorageAvailable) {
           try { return localStorage.getItem(key); } catch (e) {}
         }
         return this.memoryFallback[key] || null;
       }
     }
     ```

---

## 4. Microphone Handling & Hardware Lifecycle

### 4.1 Progressive Enhancement Contract
* The Physics mission (Sound Detective) guarantees 100% completion using its built-in synthetic oscillator.
* Microphone input is an **optional real-world exploration tool**, not a prerequisite.

### 4.2 Permission Denial Handling
* When user clicks `[ 🎙 Test Microphone ]`, the app calls `navigator.mediaDevices.getUserMedia({ audio: true })`.
* If permission is **granted**:
  * Audio stream is linked to the `AnalyserNode` for live time-domain canvas rendering.
  * Top bar status indicates: `[ Mic Active: Live Input ]`.
* If permission is **denied**, **blocked**, or **unavailable**:
  * Caught cleanly inside `catch(err)`.
  * Displays a non-intrusive toast: *"Microphone access not available. The sound lab continues using built-in synthetic tones."*
  * UI remains 100% unlocked; zero blocking modals.

### 4.3 Hardware Shutdown & Privacy Safeguards
* **Immediate Track Termination:** When the learner navigates away from S3, switches subjects, or unmounts the physics widget, the app immediately iterates through all active tracks and halts hardware capture:
  ```javascript
  if (this.mediaStream) {
    this.mediaStream.getTracks().forEach(track => track.stop());
    this.mediaStream = null;
  }
  ```
* **Strict Privacy Prohibition:**
  * **Zero Audio Uploads:** There is no server endpoint, no network socket, and no cloud bucket.
  * **Zero Audio Persistence:** Raw audio buffers are processed exclusively in volatile memory inside the `AnalyserNode` for mathematical waveform plotting. No audio is serialized to disk or `localStorage`.

---

## 5. Child Data Protection & Privacy Architecture

*Note: Formal legal compliance with the DPDP Act 2023 has not been assessed by legal counsel. The following describe the factual engineering and data-handling choices implemented:*

1. **Zero Personally Identifiable Information (PII):**
   * The application does not collect, prompt for, or store names, email addresses, phone numbers, Aadhaar numbers, school names, or GPS locations.
2. **Anonymous Local Session Progress:**
   * Single learner progress on shared family devices operates through a generic local key (`pocketlab_progress`). Multi-student profile switcher UI (`profile_1` / `profile_2`) is deferred from the MVP to preserve simplicity.
   * Progress records contain strictly binary step completion flags and numeric quiz scores.
3. **No External Trackers:**
   * Zero third-party analytics (no Google Analytics, no Facebook Pixel, no Sentry telemetry).
   * Zero external advertising SDKs.
