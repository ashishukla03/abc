# FLAGSHIP MODULE SPECIFICATION: SOUND DETECTIVE (PHYSICS)

**Document ID:** SPEC-MODULE-PHYS-SOUND-V2  
**Subject:** Physics  
**Module Name:** Sound Detective (Acoustics: Frequency, Pitch & Amplitude)  
**Curriculum Standard:** NCERT Class 8 Science Chapter 13: Sound (*Independently Verified*)  
**Status:** Implementation-Ready Module Specification (Zero Application Code Authored)  

---

## 1. Measurable Learning Objective
Given synthetic audio tones and real-time visual oscilloscope waveforms at $220\text{ Hz}$ and $440\text{ Hz}$, the learner will distinguish frequency (pitch) from amplitude (loudness) by correctly predicting that doubling frequency doubles wave cycles per second while leaving wave height unchanged, answering both (2 out of 2, 100%) transfer exit-check questions correctly.

---

## 2. Short Learner Scenario
At a village cultural festival, musicians play traditional instruments: a bamboo flute emits a high, shrill note ($440\text{ Hz}$), while a large temple drum (*dholak*) rumbles with a deep, low thud ($220\text{ Hz}$). The festival sound engineer needs to adjust the sound system so the high flute can be heard clearly without turning up the volume so loud that it distorts the speakers.

---

## 3. Initial Prediction Question
* **Prompt Key:** `phys.pred.prompt`
  * **English:** "If an instrument increases its vibration frequency from 220 Hz to 440 Hz, what difference will you hear?"
  * **Kannada [PENDING REVIEW]:** "ಒಂದು ವಾದ್ಯವು ತನ್ನ ಕಂಪನ ಆವರ್ತನವನ್ನು 220 Hz ನಿಂದ 440 Hz ಗೆ ಹೆಚ್ಚಿಸಿದರೆ, ನೀವು ಕೇಳುವ ಧ್ವನಿಯಲ್ಲಿ ಏನು ವ್ಯತ್ಯಾಸವಾಗುತ್ತದೆ?"
* **Options:**
  * Option A: The pitch sounds higher (more shrill) [CORRECT]
  * Option B: The sound automatically becomes louder [Misconception PHYS-M1]
  * Option C: The sound wave travels twice as fast across the room [Misconception PHYS-M2]
* **Pedagogical Explanation:** "Frequency measures how many times the air vibrates back and forth each second. Higher frequency creates a higher **pitch**. 440 Hz vibrates twice as fast as 220 Hz, producing a note exactly one musical octave higher! Loudness depends solely on wave amplitude, and sound speed in air is constant."

---

## 4. Input Variables, Accepted Ranges & Initial Values

| Variable Name | Type | Range / Options | Initial Default | Physical Meaning & Unit |
| :--- | :--- | :--- | :---: | :--- |
| `selectedPreset` | Enum | `['220Hz', '440Hz', 'custom']` | `'220Hz'` | Instant reference frequency preset |
| `frequencyHz` | Integer | $100\text{ Hz} - 800\text{ Hz}$ (Step: $10\text{ Hz}$) | $220\text{ Hz}$ | Rate of vibration in cycles per second (Hertz) |
| `amplitudePercent`| Integer | $10\% - 100\%$ (Step: $5\%$) | $50\%$ | Wave displacement / Volume gain scale (%) |
| `isPlaying` | Boolean | `true | false` | `false` | Master Web Audio oscillator state |
| `micModeActive` | Boolean | `true | false` | `false` | Optional live microphone input stream toggle |

---

## 5. Deterministic Interaction Rules

1. **Preset State 1 ($220\text{ Hz}$ — Low Tone):**
   * Sets `frequencyHz = 220`, `amplitudePercent = 50`.
   * Oscilloscope renders **2.2 complete sine wave cycles** across the labeled $10\text{ ms}$ horizontal window ($t = 0\text{ to } 10\text{ ms}$).
   * Audio synthesizer produces a clean, low-pitched sine hum.
2. **Preset State 2 ($440\text{ Hz}$ — High Tone):**
   * Sets `frequencyHz = 440`, `amplitudePercent = 50`.
   * Oscilloscope renders **4.4 complete sine wave cycles** across the identical $10\text{ ms}$ window (exactly $2\times$ horizontal wave compression).
   * Audio synthesizer produces a tone exactly one octave higher.
3. **Amplitude Modification Rule:**
   * Adjusting `amplitudePercent` from $20\%$ to $90\%$ scales the vertical peak height of the wave proportionally ($y(t) = A \cdot \sin(2\pi f t)$).
   * **Invariant:** The horizontal spacing between wave crests remains strictly unchanged.
4. **Playback & Autoplay Guard Rule:**
   * Sound **never plays automatically** on page load.
   * `AudioContext` initializes in `'suspended'` state and is resumed strictly on explicit click/touch.
   * Clamping: Web Audio `GainNode` is clamped to maximum $0.70$ ($-3\text{ dBFS}$) as a software ceiling to prevent digital DAC clipping distortion. Note that digital software gain clamping does not guarantee biological hearing protection or prevent physical speaker hardware damage at high device amplifier levels. Initial volume defaults conservatively to $20\%–30\%$, and persistent mute/stop controls are always accessible.
   * Actual-Device Playback Verification: Prior to presentation, verify on representative physical test devices: reliable tone playback start, working user volume adjustment, immediate stop/mute responsiveness, and absence of harsh audio distortion (without claiming calibrated SPL or guaranteed acoustic safety).
5. **Microphone Progressive Enhancement Rule:**
   * Clicking `[ 🎙 Test Microphone ]` calls `navigator.mediaDevices.getUserMedia({ audio: true })`.
   * If denied or blocked: Rejection is caught in `try/catch`. Non-blocking toast appears: *"Microphone optional. Built-in tone generator active."* Lesson continues with zero interruption.
   * Immediate Cleanup: Navigating away halts all media stream tracks immediately.

---

## 6. Visual Output & Equivalent Textual Description

* **Visual Output:** An HTML5 Oscilloscope Canvas ($600 \times 240\text{ px}$, responsive $100\%$) displaying a crisp violet sine wave (`#087E79`) on a white background with labeled axes ($X = \text{Time 0 to 10 ms}$, $Y = \text{Amplitude -1.0 to +1.0}$) configured as an illustrative educational oscilloscope.
* **Equivalent Textual Description:**
  * At $220\text{ Hz}$: `"Oscilloscope Display: Frequency 220 vibrations per second. Waveform shows 2.2 complete cycles across the 10 millisecond window. Amplitude height: 50%."`
  * At $440\text{ Hz}$: `"Oscilloscope Display: Frequency 440 vibrations per second. Waveform shows 4.4 complete cycles across the 10 millisecond window (exactly twice as many wave crests, 2x horizontal compression). Amplitude height: 50%."`

---

## 7. Likely Misconceptions & Targeted Feedback

* **PHYS-M1 (Loudness Equals Pitch):** Believing that turning up the volume increases the pitch/frequency.  
  * *Targeted Feedback:* `"Listen carefully and look at the wave! When you increase amplitude, the sound gets louder and the wave gets taller, but the number of waves across the screen does not change (pitch remains the same)."`
* **PHYS-M2 (Pitch Alters Travel Velocity):** Believing that high-pitch sounds travel through the air faster than low-pitch sounds.  
  * *Targeted Feedback:* `"All sounds travel through air at the same speed (~340 meters per second). High frequency means the air vibrates back and forth faster, not that the sound travels across the room faster!"`
* **PHYS-M3 (Wave Height Equals Frequency):** Confusing the vertical axis (amplitude) with the horizontal axis (frequency/time).  
  * *Targeted Feedback:* `"Wave height shows Amplitude (how loud the sound is). How tightly packed the wave crests are horizontally shows Frequency (how high the pitch is)."`

---

## 8. Changed Retry Question
* **Prompt Key:** `phys.retry.prompt`
  * **English:** "Two sound waves have the exact same height, but Wave 2 has twice as many peaks per second as Wave 1. How does Wave 2 sound?"
  * **Kannada [PENDING REVIEW]:** "ಎರಡು ಧ್ವನಿ ತರಂಗಗಳು ಒಂದೇ ಎತ್ತರವನ್ನು ಹೊಂದಿವೆ, ಆದರೆ 2 ನೇ ತರಂಗವು 1 ನೇ ತರಂಗಕ್ಕಿಂತ ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ಎರಡು ಪಟ್ಟು ಹೆಚ್ಚು ತರಂಗಗಳನ್ನು ಹೊಂದಿದೆ. 2 ನೇ ತರಂಗ ಹೇಗೆ ಕೇಳಿಸುತ್ತದೆ?"
* **Options:**
  * Option A: Wave 2 is louder
  * Option B: Wave 2 has a higher pitch [CORRECT]
  * Option C: Wave 2 travels faster through the air
* **Explanation:** "More peaks per second means higher frequency. Frequency determines pitch, so Wave 2 has a higher pitch."

---

## 9. Exit Questions, Answer Keys & Scoring Rules
* **Exit Check 1 (Transfer Problem):**
  * *Prompt:* "A baby bird chirps with a high-pitched sound, while a lion roars with a deep rumble. However, the lion's roar is much louder. Which sound wave has higher frequency?"
  * *Options:* Option A: The baby bird's chirp [CORRECT] | Option B: The lion's roar | Option C: Both have the same frequency.
  * *Explanation:* "Pitch is determined by frequency. Even though the chirp is quiet (low amplitude), its high pitch means it has a higher frequency than the deep roar."
* **Exit Check 2 (Conceptual Unit Transfer):**
  * *Prompt:* "What standard scientific unit is used to measure the frequency of a sound wave?"
  * *Options:* Option A: Meters | Option B: Hertz (Hz) [CORRECT] | Option C: Kilograms.
  * *Explanation:* "Frequency is measured in Hertz (Hz), which represents the number of wave cycles per second."
* **Scoring Rules:** Prediction (0 pts formative); Exit Checks (1 pt each, total 2 pts).

---

## 10. State Reset & Navigation Rules
* **Reset Action:** Clicking `[ ↺ Reset Lab ]` stops the audio oscillator, halts microphone capture, and restores sliders to $220\text{ Hz}$ and $50\%$ amplitude without wiping prediction or exit-check scores.
* **Backward Navigation:** Returning from S3 to S2 preserves the learner's previous radio hypothesis. Returning from S4 to S3 preserves the exact slider positions last configured.

---

## 11. Acceptance Tests (10 Concrete Cases)
1. **TC-PHYS-01:** On S3 load, verify zero audio plays before user interaction.
2. **TC-PHYS-02:** Tap `[ Play 220 Hz ]`; verify audible low hum and wave cycle count ($2.2$ cycles across the labeled $10\text{ ms}$ window).
3. **TC-PHYS-03:** Tap `[ Play 440 Hz ]`; verify pitch jumps one octave higher and wave cycles double ($4.4$ cycles across the identical $10\text{ ms}$ window, demonstrating exact $2\times$ compression).
4. **TC-PHYS-04:** Slide frequency from $220\text{ Hz}$ to $440\text{ Hz}$ using continuous slider; verify wave compresses smoothly at 60 FPS.
5. **TC-PHYS-05:** Slide amplitude from $20\%$ to $90\%$ at $440\text{ Hz}$; verify sound volume increases, wave height expands vertically, and horizontal peak spacing is invariant.
6. **TC-PHYS-06:** Tap `[ ⏹ Stop Tone ]`; verify audio ceases instantly and canvas halts oscillation.
7. **TC-PHYS-07:** Tap `[ 🎙 Test Microphone ]` and click "Block"; verify non-blocking toast appears and lab remains 100% playable.
8. **TC-PHYS-08:** Disconnect or mute headphones; verify visual waveform continues plotting accurately.
9. **TC-PHYS-09:** Verify output gain clamped to $\le 0.70$ ($-3\text{ dBFS}$) in Web Audio graph to prevent digital clipping/distortion.
10. **TC-PHYS-10:** Verify screen copy makes no claims of calibrated decibel SPL meters.

---

## 12. Age-Appropriate Localization Keys

```json
{
  "phys.title": "Sound Detective",
  "phys.scope": "See and hear frequency, pitch, and loudness.",
  "phys.pred.prompt": "If an instrument increases its vibration frequency from 220 Hz to 440 Hz, what difference will you hear?",
  "phys.pred.opt_pitch": "The pitch sounds higher (more shrill)",
  "phys.pred.opt_loud": "The sound automatically becomes louder",
  "phys.pred.opt_speed": "The sound wave travels twice as fast across the room",
  "phys.fb.m1": "Listen carefully and look at the wave! When you increase amplitude, the sound gets louder, but the pitch stays the same.",
  "phys.fb.m2": "All sounds travel through air at the same speed (~340 m/s). Frequency changes vibration rate, not travel speed!",
  "phys.safety.volume_warning": "Protect your hearing: Keep headphone volume at a comfortable level."
}
```

---

## 13. Content Sources & Licensing
* **Curricular Source:** NCERT Class 8 Science Chapter 13 (Sound), Government of India.
* **Scientific Standard:** Halliday, Resnick, & Walker, *Fundamentals of Physics* (Acoustics).
* **Licensing Requirements:** 100% original code authored using the open W3C Web Audio API standard. Zero Phyphox source code or trademarks utilized.

---

## 14. Risks & Human Review Gates
* **Ambient Noise Risk:** Hackathon auditorium may be loud during judging.  
  * *Control:* The synthetic tone generator with visual canvas confirmation guarantees demonstration success even in noisy environments.
* **Human Approval Required:** Confirm Kannada localization review by a native-speaking educator before the final code freeze.
