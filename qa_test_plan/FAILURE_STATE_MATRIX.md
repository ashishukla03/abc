# FAILURE STATE & HARDWARE RESILIENCE MATRIX

**Document ID:** QA-FAILURE-MATRIX-V2  
**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Role:** Independent QA Engineer & Resilience Specialist  
**Objective:** Define deterministic, graceful degradations for every external hardware, storage, and network failure mode.  

---

## 1. System Failure Mode & Resilience Matrix

| Failure Mode ID | Subsystem | Triggering Condition | Immediate Failure Impact | Engineered Graceful Degradation & User Contract | Severity |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **FAIL-01** | **Offline Caching** | First-ever visit to URL while completely offline (uncached device). | Browser cannot fetch `index.html` or static assets. | Browser displays its native offline error. The team mitigates this by pre-caching all demo devices on venue Wi-Fi before presenting to judges. | **Blocker** |
| **FAIL-02** | **Audio Autoplay** | Mobile browser blocks Web Audio initialization prior to user touch. | AudioContext suspended; synthetic tones produce zero sound. | Explicit "Tap to Enable Sound & Enter Lab" button synchronously calls `audioCtx.resume()` before mounting the physics canvas. | **Blocker** |
| **FAIL-03** | **Microphone Denial** | User taps "Block" on browser microphone permission prompt. | `getUserMedia()` rejects with `NotAllowedError`. | Rejection caught cleanly in `try/catch`. Non-blocking toast appears: *"Microphone optional. Built-in tone generator active."* Lesson completes 100%. | **High** |
| **FAIL-04** | **Microphone Missing** | Budget device lacks accessible microphone hardware. | `navigator.mediaDevices` undefined or throws `NotFoundError`. | Handled identically to denial: defaults cleanly to synthetic generator without crashing or showing unhandled exceptions. | **Medium** |
| **FAIL-05** | **Storage Quota / Incognito** | Browser blocks `localStorage` access (Private mode / Quota exceeded). | `localStorage.setItem()` throws `SecurityError`. | SafeStorageManager catches error silently and falls back to a volatile in-memory JavaScript object. Session works flawlessly until tab close. | **High** |
| **FAIL-06** | **Audio Hardware Mute** | Student device physical mute switch is toggled ON. | Audio tones play into suspended output. | UI displays visual oscilloscope waveform and numerical frequency indicators, ensuring learning transfer occurs visually even if silent. | **Medium** |
| **FAIL-07** | **Incomplete Kannada Translations** | Localization dictionary missing a specific Kannada string. | Key renders as undefined or empty. | Translation lookup function automatically falls back to the verified English string (`i18n[key]?.kn || i18n[key]?.en`), preventing raw key leaks. | **High** |
| **FAIL-08** | **Mid-Session Network Drop** | Cellular data connection drops while student is on Step S3. | Network fetch requests fail. | Service Worker serves all assets from local cache; top bar offline pill illuminates green. Zero disruption to learning flow. | **Low** (Handled natively) |
| **FAIL-09** | **Math Invariant Exceeded** | Learner inputs numbers summing to $> 12$ units. | Mathematical ratio logic violated. | Stepper UI displays red/amber count: `"Exceeded by X units"`; Check button is disabled (`aria-disabled="true"`). | **High** |
| **FAIL-10** | **Accidental Page Reload** | Learner accidentally swipes down to refresh on Android Chrome. | DOM reconstructed from scratch. | App initializes state from `localStorage.getItem('pocketlab_state_v1')`, restoring the learner to the exact current subject and step. | **Medium** |
