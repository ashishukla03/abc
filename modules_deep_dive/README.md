# Gramin PocketLab — Module Deep Dive Index

**Project:** Gramin PocketLab — Four-Subject STEM Missions  
**Event:** STEM for Impact 2026 (Presidency University, Bengaluru)  
**Role:** Subject-Module Specialist  
**Design Standard:** Rigorous scientific accuracy, interactive determinism, and testability across all four modules, spotlighting the Physics flagship module. **Zero application code authored; zero unrun claims.**  

---

## Deliverables Directory

1. **[PHYSICS_SOUND_DETECTIVE_SPEC.md](./PHYSICS_SOUND_DETECTIVE_SPEC.md)**
   * Complete 14-point module specification for **Physics: Sound Detective** (NCERT Class 8 Science Chapter 13).
   * Measurable learning objective, festival music scenario, prediction item, input bounds ($100–800\text{ Hz}$, presets $220\text{ Hz}$ vs. $440\text{ Hz}$), deterministic 60 FPS oscilloscope canvas rules, visual-textual equivalents, 3 misconceptions (loudness=pitch, travel velocity, wave height), changed retry question, exit checks, scoring rules, state resets, age-appropriate localization keys, and licensing controls.

2. **[PHYSICS_SOUND_DETECTIVE_QUESTIONS.csv](./PHYSICS_SOUND_DETECTIVE_QUESTIONS.csv)**
   * Structured spreadsheet mapping all Prediction, Retry, and Exit Check questions for the Physics module with English prompts, options, correct keys, targeted misconception tags, and detailed pedagogical rationale scripts.

3. **[PHYSICS_SOUND_DETECTIVE_ACCEPTANCE_TESTS.csv](./PHYSICS_SOUND_DETECTIVE_ACCEPTANCE_TESTS.csv)**
   * 10 concrete, observable acceptance tests covering zero autoplay on load, octave pitch jumps ($220 \rightarrow 440\text{ Hz}$), amplitude vertical scaling with invariant horizontal wavelength, stop controls, non-blocking microphone denial, immediate hardware track release, and $-3\text{ dBFS}$ audio clamping.
