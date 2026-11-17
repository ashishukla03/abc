/**
 * Gramin PocketLab — Internationalization & Localization Engine
 * File: app/content/i18n.js
 * Architecture Contract: architecture_plan/MODULE_INTERFACE_CONTRACT.md
 * Standard: Pure ES6 Module, English (primary) & Kannada (draft educator strings)
 * Safe fallback to English for any missing or blank keys.
 */

import { store } from '../js/store.js';

export const SUPPORTED_LOCALES = ['en', 'kn'];
export const DEFAULT_LOCALE = 'en';

/**
 * Complete Localization Dictionary
 */
export const DICTIONARY = {
  en: {
    // -------------------------------------------------------------------------
    // Global Shell, Header & Navigation
    // -------------------------------------------------------------------------
    'app.title': 'Gramin PocketLab',
    'app.tagline': 'Four-Subject STEM Missions for Rural Schools',
    'app.offline_ready': 'Offline Ready',
    'app.online': 'Online',
    'app.skip_link': 'Skip to main content',
    'app.locale_toggle_label': 'Switch language between English and Kannada',
    'app.audio_mute_label': 'Mute audio tones',
    'app.audio_unmute_label': 'Unmute audio tones',
    'app.reset_label': 'Reset lab or mission',
    'app.session_badge': 'Single Learner Local Session (Offline)',

    // Buttons
    'btn.back': '← Back',
    'btn.next': 'Next →',
    'btn.continue': 'Continue →',
    'btn.enter_lab': 'Enter Lab →',
    'btn.start_investigation': 'Start Investigation (Predict) →',
    'btn.submit_prediction': 'Submit Prediction →',
    'btn.observed_result': 'I Have Observed the Result →',
    'btn.check_understanding': 'Check My Understanding →',
    'btn.check_answer': 'Check Answer',
    'btn.try_retry': 'Try Changed Question',
    'btn.check_retry': 'Check Retry Answer',
    'btn.proceed_final': 'Proceed to Final Check →',
    'btn.submit_final': 'Submit Final Check',
    'btn.return_map': 'Return to Mission Map →',
    'btn.replay_lab': '↺ Replay Investigation',
    'btn.reset': 'Reset',
    'btn.reset_lab': '↺ Reset Lab',
    'btn.reset_all': 'Reset All Missions',
    'btn.cancel': 'Cancel',

    // Status Badges
    'status.completed': 'Completed',
    'status.in_progress': 'In Progress',
    'status.not_started': 'Not Started',
    'status.mastered': 'Mastered',
    'status.high_pitch': 'High Pitch (440 Hz)',
    'status.low_pitch': 'Low Pitch (220 Hz)',
    'status.acidic': 'Acidic (pH < 7)',
    'status.neutral': 'Neutral (pH = 7)',
    'status.basic': 'Basic / Alkaline (pH > 7)',

    // Reset Modal
    'modal.reset_title': 'Reset Mission Options',
    'modal.reset_desc': 'You can reset only the current interactive experiment to test different variables, or reset all progress across all four STEM subjects.',
    'modal.btn_cancel': 'Cancel',
    'modal.btn_reset_lab': 'Reset Lab Only',
    'modal.btn_reset_all': 'Reset All Missions',

    // -------------------------------------------------------------------------
    // S0: Mission Map / Dashboard
    // -------------------------------------------------------------------------
    'map.title': 'Gramin PocketLab',
    'map.subtitle': 'Explore real-world science and mathematics through four interactive field investigations designed for rural schools.',
    'map.instructions': 'Choose any STEM mission below to begin your inquiry-driven investigation:',
    'map.progress_summary': '{completed} of 4 Missions Completed',

    // Subject Cards Metadata
    'subject.physics.name': 'Physics',
    'subject.physics.title': 'Sound Detective',
    'subject.physics.desc': 'See and hear frequency, pitch, and loudness.',
    'subject.physics.standard': 'NCERT Class 8 Science Ch 13',
    'subject.physics.duration': '~6–8 mins',

    'subject.math.name': 'Mathematics',
    'subject.math.title': 'Water Share Challenge',
    'subject.math.desc': 'Divide community irrigation water proportionally using ratios.',
    'subject.math.standard': 'NCERT Class 6 Mathematics Ch 12',
    'subject.math.duration': '~5–7 mins',

    'subject.biology.name': 'Biology',
    'subject.biology.title': 'Food Web Explorer',
    'subject.biology.desc': 'Discover how energy flows and what happens when predators vanish.',
    'subject.biology.standard': 'NCERT Class 7 Science Ch Forests',
    'subject.biology.duration': '~5–7 mins',

    'subject.chemistry.name': 'Chemistry',
    'subject.chemistry.title': 'pH Color Lab',
    'subject.chemistry.desc': 'Test acids, neutrals, and bases using natural indicators.',
    'subject.chemistry.standard': 'NCERT Class 7 Science Ch 5',
    'subject.chemistry.duration': '~5–7 mins',

    // -------------------------------------------------------------------------
    // S1: Mission Brief (Intro)
    // -------------------------------------------------------------------------
    's1.heading': 'Mission Brief',
    's1.objective_title': 'Learning Objective',
    's1.offline_badge': '100% Offline Ready',

    // Math S1
    'math.s1.scenario': 'A village community tank stores water for three adjacent crop plots: Plot A (kitchen herb garden), Plot B (groundnut patch), and Plot C (fruit orchard). The farmers agree the plots need water in the ratio 1 : 2 : 3. If the tank holds 12 total units, how should the water be divided fairly without wasting a single drop?',
    'math.s1.objective': 'Given a fixed total of 12 units of water and a 1 : 2 : 3 ratio, calculate and allocate proportional shares (2, 4, 6 units) such that all water is used and each plot receives its exact mathematical proportion.',

    // Bio S1
    'bio.s1.scenario': 'In a Karnataka agricultural field ecosystem, green paddy crops harness sunlight. Grasshoppers feed on the crops, frogs eat the grasshoppers, rat snakes prey on frogs, and barn owls hunt in the fields. What happens to the balance when one species is removed from this interconnected web?',
    'bio.s1.objective': 'Trace the direction of energy flow through a rural farm food web and predict the qualitative indirect ecological consequences (trophic cascade) when top predators or primary producers are disturbed.',

    // Chem S1
    'chem.s1.scenario': 'A village health and water-testing camp is testing common liquids: fresh lemon juice, distilled reference water, baking soda solution, and laundry soap solution. Using natural yellow turmeric paper and universal indicator strips, how can we determine which solutions are acidic, neutral, or basic?',
    'chem.s1.objective': 'Test aqueous solutions with natural turmeric and universal indicators, categorize them as acidic (pH < 7), neutral (pH = 7), or basic (pH > 7), and recognize that neutral pH alone does not prove water is biologically sterile or safe to drink.',

    // Phys S1
    'phys.s1.scenario': 'At a village festival music workshop, a musician plays two traditional instruments: a bamboo flute producing a high, shrill note (440 Hz, musical note A4), and a large temple drum (dholak) producing a deep, low rumble (220 Hz, musical note A3). How do wave vibrations determine what our ears perceive?',
    'phys.s1.objective': 'Distinguish frequency (pitch) from amplitude (loudness) by synthesizing 220 Hz and 440 Hz tones and observing that doubling frequency doubles wave peaks per second on an oscilloscope without changing wave height.',

    // -------------------------------------------------------------------------
    // S2: Formative Prediction
    // -------------------------------------------------------------------------
    's2.heading': 'Make Your Prediction',
    's2.callout': 'Make your best hypothesis! There is no penalty for incorrect guesses.',
    's2.select_prompt': 'Select one hypothesis before entering the interactive micro-lab:',

    // Math S2
    'math.pred.prompt': 'A storage tank holds 12 units of water to be shared among three plots in the ratio 1 : 2 : 3. How many units should the largest plot (Plot C) receive?',
    'math.pred.opt_a': '3 units',
    'math.pred.opt_b': '4 units',
    'math.pred.opt_c': '6 units',
    'math.pred.explain': 'Plot C has 3 parts out of 1 + 2 + 3 = 6 total parts. Since 3 parts is half of 6 total parts, Plot C gets half of all water: 12 ÷ 2 = 6 units!',

    // Bio S2
    'bio.pred.prompt': 'In our farm ecosystem, what is most likely to happen to the grasshopper population if farmers remove all the rat snakes from the fields?',
    'bio.pred.opt_a': 'Grasshopper population decreases',
    'bio.pred.opt_b': 'Grasshopper population increases',
    'bio.pred.opt_c': 'Grasshopper population remains exactly unchanged',
    'bio.pred.explain': 'When snakes are removed, fewer frogs are eaten, so frog numbers surge. More frogs eat more grasshoppers, causing grasshoppers to decline!',

    // Chem S2
    'chem.pred.prompt': 'Turmeric is a natural yellow indicator. When you rub yellow turmeric paste onto basic laundry soap, what color does it turn?',
    'chem.pred.opt_a': 'Turns bright blue',
    'chem.pred.opt_b': 'Turns reddish-brown',
    'chem.pred.opt_c': 'Remains yellow',
    'chem.pred.explain': 'Curcumin in turmeric reacts with alkaline (basic) substances like soap to turn deep reddish-brown. In acids and neutral water, it stays yellow!',

    // Phys S2
    'phys.pred.prompt': 'If a musician plays a tone at 440 Hz instead of 220 Hz, what difference will you hear?',
    'phys.pred.opt_a': 'The pitch sounds higher (more shrill)',
    'phys.pred.opt_b': 'The sound automatically becomes louder',
    'phys.pred.opt_c': 'The sound wave travels twice as fast across the room',
    'phys.pred.explain': 'Frequency measures how many times the wave vibrates per second. Higher frequency means higher pitch! 440 Hz is exactly one musical octave higher than 220 Hz.',

    // -------------------------------------------------------------------------
    // S3: Interactive Micro-Lab Prompts & Disclaimers
    // -------------------------------------------------------------------------
    's3.heading': 'Interactive Micro-Lab',
    's3.math_prompt': 'Adjust the stepper buttons for Plot A, B, and C until all 12 units are allocated and the 1 : 2 : 3 ratio is satisfied.',
    's3.bio_prompt': 'Select different disturbance scenarios to observe how energy transfer and species populations shift across the food web.',
    's3.chem_prompt': 'Select liquid beakers and test them using Natural Turmeric Paper and Universal Indicator Paper to observe color reactions.',
    's3.phys_prompt': 'Play the 220 Hz and 440 Hz tones. Watch the live oscilloscope canvas and compare wave crest density with sound pitch.',

    // Mandatory Chemistry Potability Warning
    'chem.safety_disclaimer': 'Notice: Educational simulation. A pH test measures hydrogen ion activity; it does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals. A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety.',
    'phys.audio_notice': 'Audio Notice: Synthetic audio tones play only when initiated. Sound synthesizer uses safe listening amplitudes.',

    // -------------------------------------------------------------------------
    // S4: Concept Understanding
    // -------------------------------------------------------------------------
    's4.heading': 'Concept Understanding',
    's4.observed_recap_title': 'Connecting Observation to Scientific Law',
    's4.rule_box_title': 'Field Notebook Rule Box',

    // Math S4
    'math.s4.observed': 'In the lab, you observed that allocating 2 units to Plot A, 4 units to Plot B, and 6 units to Plot C used all 12 units while maintaining double and triple proportions.',
    'math.s4.p1': 'A ratio like 1 : 2 : 3 does not represent fixed liters or units. It means the entire quantity is divided into 1 + 2 + 3 = 6 equal parts or "slices".',
    'math.s4.p2': 'To find what one part is worth (the unit value U), divide total water (12) by total parts (6), yielding U = 2 units per part. Each plot then gets its share: Plot A = 1 × 2 = 2, Plot B = 2 × 2 = 4, and Plot C = 3 × 2 = 6.',
    'math.s4.rule': 'To divide a total quantity T into ratio a : b : c, calculate total parts P = a + b + c. Find unit part U = T ÷ P. Then each share is a × U, b × U, and c × U.',

    // Bio S4
    'bio.s4.observed': 'In the lab, you observed that removing rat snakes caused frog numbers to spike, which subsequently caused grasshopper numbers to drop.',
    'bio.s4.p1': 'In a food web, directed arrows indicate the pathway of food energy—from the organism being eaten to the consumer that eats it (Prey → Consumer).',
    'bio.s4.p2': 'Living organisms are linked in an intricate ecological network. A change in one population triggers cascading ripple effects (trophic cascades) across non-adjacent species throughout the ecosystem.',
    'bio.s4.rule': 'Food web arrows represent the flow of biological energy. Disrupting a top predator alters intermediate consumer populations, triggering indirect consequences for primary producers and herbivores.',

    // Chem S4
    'chem.s4.observed': 'In the lab, you observed that lemon juice turned universal paper red (pH 2.2), distilled water turned it green (pH 7.0), and basic solutions turned turmeric paper reddish-brown.',
    'chem.s4.p1': 'The pH scale quantifies hydrogen ion concentration from 0 to 14. Solutions with pH < 7 are acidic, solutions with pH = 7 are neutral, and solutions with pH > 7 are basic / alkaline.',
    'chem.s4.p2': 'Chemical indicators undergo reversible structural color changes depending on acidity. Turmeric is a natural indicator containing curcumin that turns reddish-brown exclusively in alkaline (basic) solutions.',
    'chem.s4.rule': 'pH < 7 = Acidic; pH 7 = Neutral; pH > 7 = Basic. Always remember: pH measures chemical hydrogen ions only—it does not test for biological pathogens or drinking water safety.',

    // Phys S4
    'phys.s4.observed': 'In the lab, you observed that switching from 220 Hz to 440 Hz produced a noticeably higher, shriller pitch, and the oscilloscope showed exactly twice as many wave peaks in the same window.',
    'phys.s4.p1': 'Frequency is the number of complete vibration cycles per second, measured in Hertz (Hz). Higher frequency creates a sound that the human ear perceives as a higher musical pitch.',
    'phys.s4.p2': 'Amplitude is the physical height of the wave crests from the center line. Larger amplitude transfers more acoustic energy, which the ear perceives as louder sound. Pitch and loudness are completely independent physical properties.',
    'phys.s4.rule': 'Frequency (vibrations per second in Hz) governs Pitch. Amplitude (wave peak height) governs Loudness. Doubling frequency doubles the wave crests per second without making the sound louder.',

    // -------------------------------------------------------------------------
    // S5: Formative Feedback & Targeted Retry
    // -------------------------------------------------------------------------
    's5.heading': 'Check Your Understanding',
    's5.diagnostic_label': 'Diagnostic Check',
    's5.retry_heading': 'Changed Retry Question',
    's5.success_title': 'Correct! Scientific Principle Reinforced:',
    's5.misconception_title': 'Conceptual Scaffolding — Look at the Evidence:',

    // Math S5 Diagnostic & Feedback
    'math.formative.prompt': 'A community gardener wants to share 12 kg of compost among two garden beds in the ratio 1 : 3. A helper suggests giving 4 kg to Bed 1 and 8 kg to Bed 2. Is this distribution correct?',
    'math.formative.opt_a': 'Yes, because 4 + 8 = 12 kg total.',
    'math.formative.opt_b': 'No, because Bed 2 would have only double Bed 1, not triple (should be 3 kg and 9 kg).',
    'math.formative.opt_c': 'Yes, because 1 : 3 means Bed 2 gets 4 more kg than Bed 1.',
    'math.formative.explain': 'Total parts = 1 + 3 = 4. Each part = 12 ÷ 4 = 3 kg. Bed 1 gets 1 × 3 = 3 kg, Bed 2 gets 3 × 3 = 9 kg. 4 kg and 8 kg gives a 1 : 2 ratio!',
    'math.fb.additive': 'Notice the difference: 4 and 8 adds to 12, but 8 is only 2 × 4 (a 1 : 2 ratio). In a 1 : 3 ratio, the second share must be 3 times larger: 3 × 3 = 9 kg!',

    // Math S5 Retry
    'math.retry.prompt': 'A new tank holds 18 units of water. If you divide it in the ratio 1 : 2 between two plots (Plot X and Plot Y), how many units does Plot Y receive?',
    'math.retry.opt_a': '6 units',
    'math.retry.opt_b': '12 units',
    'math.retry.opt_c': '9 units',
    'math.retry.explain': 'Total parts = 1 + 2 = 3. Each part = 18 ÷ 3 = 6 units. Plot Y gets 2 parts = 2 × 6 = 12 units.',

    // Bio S5 Diagnostic & Feedback
    'bio.formative.prompt': 'If a viral blight kills all the paddy crops in the farm ecosystem, why do the barn owls face starvation even though owls do not eat paddy grass?',
    'bio.formative.opt_a': 'Owls are herbivores and eat paddy grain at night.',
    'bio.formative.opt_b': 'Field mice starve without paddy grain, so owls lose their primary prey.',
    'bio.formative.opt_c': 'Owls only starve if rat snakes also leave.',
    'bio.formative.explain': 'Producers (paddy) capture sunlight energy. Without crops, primary consumers (mice) perish, depriving top predators (owls) of food.',
    'bio.fb.producer': 'Remember: all biological energy originates with green producer plants. Without producers, the foundation of the entire food web collapses.',

    // Bio S5 Retry
    'bio.retry.prompt': 'If field mice drop sharply because of disease, which animal faces a direct food shortage?',
    'bio.retry.opt_a': 'Grasshoppers',
    'bio.retry.opt_b': 'Barn Owls',
    'bio.retry.opt_c': 'Frogs',
    'bio.retry.explain': 'Barn owls prey directly on field mice. Losing mice directly deprives owls of a primary food source.',

    // Chem S5 Diagnostic & Feedback
    'chem.formative.prompt': 'A student dips blue litmus paper into laundry soap solution and sees no color change. She concludes the soap is neutral water. Is she correct?',
    'chem.formative.opt_a': 'Yes, any liquid that does not turn red is neutral water.',
    'chem.formative.opt_b': 'No, soap is basic; blue litmus stays blue in basic solutions.',
    'chem.formative.opt_c': 'Yes, soap has a pH of 7.0.',
    'chem.formative.explain': 'Blue litmus only changes to red in acids. In basic solutions like soap, blue litmus remains blue. One test strip alone cannot prove neutrality.',
    'chem.fb.scale': 'Caution: Inverted indicator interpretation! Bases turn red litmus blue, but blue litmus stays blue in bases. To confirm, use turmeric or universal indicator!',

    // Chem S5 Retry
    'chem.retry.prompt': 'A sample of vinegar has a pH of 3. What category does vinegar belong to?',
    'chem.retry.opt_a': 'Acidic (pH < 7)',
    'chem.retry.opt_b': 'Neutral (pH = 7)',
    'chem.retry.opt_c': 'Basic (pH > 7)',
    'chem.retry.explain': 'Any substance with a pH less than 7 is acidic. Since 3 is less than 7, vinegar is an acid.',

    // Phys S5 Diagnostic & Feedback
    'phys.formative.prompt': 'Two sound waves have equal wave crest height (amplitude), but Wave 2 has twice as many peaks per second as Wave 1. How does Wave 2 sound compared to Wave 1?',
    'phys.formative.opt_a': 'Wave 2 is much louder',
    'phys.formative.opt_b': 'Wave 2 has a higher pitch (more shrill)',
    'phys.formative.opt_c': 'Wave 2 travels twice as fast through the air',
    'phys.formative.explain': 'More peaks per second means higher frequency. Frequency determines pitch, so Wave 2 has a higher pitch. Equal height means equal loudness.',
    'phys.fb.frequency': 'Look at the waveform axes! Peak height (vertical) shows amplitude/loudness. Peak count per second (horizontal density) shows frequency/pitch. More peaks = higher pitch!',

    // Phys S5 Retry
    'phys.retry.prompt': 'A loudspeaker tone is adjusted so its wave peaks per second double, but its wave height remains identical. How does the sound change?',
    'phys.retry.opt_a': 'It gets louder at the same pitch',
    'phys.retry.opt_b': 'It sounds higher in pitch at the same loudness',
    'phys.retry.opt_c': 'It travels faster through the room',
    'phys.retry.explain': 'Doubling peaks per second doubles the frequency, creating a higher pitch tone without altering volume.',

    // -------------------------------------------------------------------------
    // S6: Exit Check & Mission Summary
    // -------------------------------------------------------------------------
    's6.heading': 'Exit Check & Mastery',
    's6.transfer_intro': 'Answer these two practical transfer questions to demonstrate your mastery:',
    's6.score_banner': 'Mission Complete: {title}',
    's6.score_text': 'Exit Check Score: {score} / 2 Correct',
    's6.mastery_awarded': 'Mastery Badge Earned:',
    's6.recap_title': 'Field Investigation Summary',
    's6.question_num': 'Question {num} of 2',

    // Math S6 Exit Checks
    'math.exit1.prompt': 'A school craft workshop mixes 30 liters of clay slurry using powdered clay and water in the ratio 1 : 5. How many liters of powdered clay are needed?',
    'math.exit1.opt_a': '5 L',
    'math.exit1.opt_b': '6 L',
    'math.exit1.opt_c': '10 L',
    'math.exit1.explain': 'Total parts = 1 + 5 = 6. Each part = 30 ÷ 6 = 5 L. Powdered clay is 1 part = 5 L.',

    'math.exit2.prompt': 'Three students share 24 notebooks in the ratio 1 : 2 : 3. How many notebooks does the student with the middle share get?',
    'math.exit2.opt_a': '4 notebooks',
    'math.exit2.opt_b': '8 notebooks',
    'math.exit2.opt_c': '12 notebooks',
    'math.exit2.explain': 'Total parts = 1 + 2 + 3 = 6. Each part = 24 ÷ 6 = 4 notebooks. Middle share is 2 parts = 2 × 4 = 8 notebooks.',

    'math.recap_1': 'Ratios represent proportional slices: total parts must be calculated first to find the single unit value.',
    'math.recap_2': 'Proportional sharing ensures fair allocation across varying resource demands.',
    'badge.math.name': 'Jal Mitra (Water Guardian)',
    'badge.math.desc': 'Mastered proportional ratio calculations for community resources.',

    // Bio S6 Exit Checks
    'bio.exit1.prompt': 'In a forest food web: Tree Leaves → Caterpillars → Small Birds → Hawks. Which organism is the producer?',
    'bio.exit1.opt_a': 'Tree Leaves',
    'bio.exit1.opt_b': 'Caterpillars',
    'bio.exit1.opt_c': 'Small Birds',
    'bio.exit1.explain': 'Green plant leaves produce their own food via photosynthesis; animals are consumers and cannot produce food.',

    'bio.exit2.prompt': 'In a pond: Water Weeds → Tadpoles → Large Beetles. What does the arrow between Tadpoles and Large Beetles represent?',
    'bio.exit2.opt_a': 'Tadpoles hunt large beetles',
    'bio.exit2.opt_b': 'Biological energy transfers from tadpoles to large beetles',
    'bio.exit2.opt_c': 'Beetles provide energy to tadpoles',
    'bio.exit2.explain': 'Arrows in food webs always point from the organism eaten to the consumer, showing the direction of biological energy transfer.',

    'bio.recap_1': 'Food web arrows depict the irreversible directional transfer of biological energy from prey to consumer.',
    'bio.recap_2': 'Removing or overhunting intermediate species creates cascading population shifts across the food web.',
    'badge.bio.name': 'Prakriti Rakshak (Ecosystem Guardian)',
    'badge.bio.desc': 'Mastered ecological energy flows and trophic cascade dynamics.',

    // Chem S6 Exit Checks
    'chem.exit1.prompt': 'A health worker tests well water and finds a pH of 7.0. Does this test alone guarantee the water is safe from bacteria and safe to drink?',
    'chem.exit1.opt_a': 'Yes, pH 7.0 guarantees total chemical and biological purity.',
    'chem.exit1.opt_b': 'No, a pH test cannot determine pathogen or toxic chemical safety.',
    'chem.exit1.opt_c': 'Yes, but only if the water is clear and cold.',
    'chem.exit1.explain': 'A pH reading only measures chemical hydrogen ion activity; it does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals and does not establish water potability.',

    'chem.exit2.prompt': 'Which of these pH values represents a basic / alkaline solution?',
    'chem.exit2.opt_a': 'pH 2',
    'chem.exit2.opt_b': 'pH 7',
    'chem.exit2.opt_c': 'pH 11',
    'chem.exit2.explain': 'Values between 8 and 14 on the pH scale are basic / alkaline. pH 11 represents a strong basic solution.',

    'chem.recap_1': 'Acids have pH < 7, neutral liquids have pH = 7, and basic solutions have pH > 7.',
    'chem.recap_2': 'A neutral pH of 7 only measures acidity/alkalinity; it never guarantees microbiological potability.',
    'badge.chem.name': 'Rasayan Shodhak (Chemistry Pioneer)',
    'badge.chem.desc': 'Mastered acid-base classification and critical water safety principles.',

    // Phys S6 Exit Checks
    'phys.exit1.prompt': 'A baby bird chirps with a high-pitched sound, while a lion roars with a deep, loud rumble. Which sound wave has a higher frequency?',
    'phys.exit1.opt_a': "The baby bird's chirp",
    'phys.exit1.opt_b': "The lion's roar",
    'phys.exit1.opt_c': 'Both sound waves have the identical frequency',
    'phys.exit1.explain': 'Pitch is governed strictly by frequency. Even though quieter (smaller amplitude), the high-pitched bird chirp vibrates with higher frequency.',

    'phys.exit2.prompt': 'What standard scientific unit is used to measure the frequency of a sound wave?',
    'phys.exit2.opt_a': 'Meters (m)',
    'phys.exit2.opt_b': 'Hertz (Hz)',
    'phys.exit2.opt_c': 'Kilograms (kg)',
    'phys.exit2.explain': 'Frequency is measured in Hertz (Hz), which counts the number of complete vibration cycles per second.',

    'phys.recap_1': 'Frequency (measured in Hertz) controls pitch; amplitude (wave height) controls volume / loudness.',
    'phys.recap_2': 'Acoustic pitch and loudness are independent properties: a quiet sound can have a very high frequency.',
    'badge.phys.name': 'Dhwani Parikshak (Sound Detective)',
    'badge.phys.desc': 'Mastered acoustic frequency, pitch, and amplitude wave dynamics.'
  },

  // ---------------------------------------------------------------------------
  // Kannada [Draft educator strings — automatic English fallback on missing]
  // ---------------------------------------------------------------------------
  kn: {
    'app.title': 'ಗ್ರಾಮೀಣ ಪಾಕೆಟ್‌ಲ್ಯಾಬ್',
    'app.tagline': 'ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಿಗಾಗಿ ಸಂವಾದಾತ್ಮಕ STEM ಪ್ರಯೋಗಗಳು',
    'app.offline_ready': 'ಆಫ್‌ಲೈನ್ ಸಿದ್ಧ',
    'app.online': 'ಆನ್‌ಲೈನ್',
    'app.skip_link': 'ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ತೆರಳಿ',
    'app.session_badge': 'ವಿದ್ಯಾರ್ಥಿ ಆಫ್‌ಲೈನ್ ಸೆಷನ್',

    'btn.back': '← ಹಿಂದಕ್ಕೆ',
    'btn.next': 'ಮುಂದೆ →',
    'btn.continue': 'ಮುಂದುವರಿಸಿ →',
    'btn.enter_lab': 'ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಪ್ರವೇಶಿಸಿ →',
    'btn.start_investigation': 'ಅನ್ವೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ (ಊಹೆ) →',
    'btn.submit_prediction': 'ಊಹೆಯನ್ನು ದೃಢೀಕರಿಸಿ →',
    'btn.observed_result': 'ನಾನು ಫಲಿತಾಂಶವನ್ನು ಗಮನಿಸಿದ್ದೇನೆ →',
    'btn.check_understanding': 'ನನ್ನ ತಿಳುವಳಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ →',
    'btn.check_answer': 'ಉತ್ತರ ಪರಿಶೀಲಿಸಿ',
    'btn.try_retry': 'ಬದಲಾದ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ',
    'btn.check_retry': 'ಮರುಪ್ರಶ್ನೆಯ ಉತ್ತರ ಪರಿಶೀಲಿಸಿ',
    'btn.proceed_final': 'ಅಂತಿಮ ಪರೀಕ್ಷೆಗೆ ಮುಂದುವರಿಯಿರಿ →',
    'btn.submit_final': 'ಅಂತಿಮ ಉತ್ತರ ಸಲ್ಲಿಸಿ',
    'btn.return_map': 'ಮಿಷನ್ ನಕ್ಷೆಗೆ ಹಿಂತಿರುಗಿ →',
    'btn.replay_lab': '↺ ಪ್ರಯೋಗ ಪುನರಾವರ್ತಿಸಿ',
    'btn.reset': 'ಮರುಹೊಂದಿಸಿ',
    'btn.reset_lab': '↺ ಲ್ಯಾಬ್ ಮರುಹೊಂದಿಸಿ',
    'btn.reset_all': 'ಎಲ್ಲವನ್ನೂ ಮರುಹೊಂದಿಸಿ',
    'btn.cancel': 'ರದ್ದುಮಾಡಿ',

    'status.completed': 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    'status.in_progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    'status.not_started': 'ಪ್ರಾರಂಭವಾಗಿಲ್ಲ',
    'status.mastered': 'ಪಾರಂಗತ',
    'status.high_pitch': 'ಹೆಚ್ಚಿನ ಶೃತಿ (440 Hz)',
    'status.low_pitch': 'ಕಡಿಮೆ ಶೃತಿ (220 Hz)',
    'status.acidic': 'ಆಮ್ಲೀಯ (pH < 7)',
    'status.neutral': 'ತಟಸ್ಥ (pH = 7)',
    'status.basic': 'ಪ್ರತ್ಯಾಮ್ಲೀಯ (pH > 7)',

    'map.title': 'ಗ್ರಾಮೀಣ ಪಾಕೆಟ್‌ಲ್ಯಾಬ್',
    'map.subtitle': 'ಗ್ರಾಮೀಣ ಶಾಲೆಗಳಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ನಾಲ್ಕು ಸಂವಾದಾತ್ಮಕ ಪ್ರಯೋಗಗಳ ಮೂಲಕ ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತವನ್ನು ಅನ್ವೇಷಿಸಿ.',
    'map.progress_summary': '4 ರಲ್ಲಿ {completed} ಮಿಷನ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ',

    'subject.physics.name': 'ಭೌತಶಾಸ್ತ್ರ',
    'subject.physics.title': 'ಧ್ವನಿ ಪತ್ತೇದಾರಿ',
    'subject.physics.desc': 'ಆವರ್ತನ, ಶೃತಿ ಮತ್ತು ಧ್ವನಿಯ ತೀವ್ರತೆಯನ್ನು ನೋಡಿ ಮತ್ತು ಕೇಳಿ.',
    'subject.physics.standard': 'NCERT 8 ನೇ ತರಗತಿ ವಿಜ್ಞಾನ ಅಧ್ಯಾಯ 13',

    'subject.math.name': 'ಗಣಿತ',
    'subject.math.title': 'ನೀರು ಹಂಚಿಕೆ ಸವಾಲು',
    'subject.math.desc': 'ಅನುಪಾತಗಳನ್ನು ಬಳಸಿ ಸಮುದಾಯದ ನೀರಾವರಿ ನೀರನ್ನು ಹಂಚಿರಿ.',
    'subject.math.standard': 'NCERT 6 ನೇ ತರಗತಿ ಗಣಿತ ಅಧ್ಯಾಯ 12',

    'subject.biology.name': 'ಜೀವಶಾಸ್ತ್ರ',
    'subject.biology.title': 'ಆಹಾರ ಜಾಲ ಅನ್ವೇಷಕ',
    'subject.biology.desc': 'ಶಕ್ತಿಯು ಹೇಗೆ ಹರಿಯುತ್ತದೆ ಮತ್ತು ಪರಭಕ್ಷಕಗಳು ಕಣ್ಮರೆಯಾದಾಗ ಏನಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ಅನ್ವೇಷಿಸಿ.',
    'subject.biology.standard': 'NCERT 7 ನೇ ತರಗತಿ ವಿಜ್ಞಾನ',

    'subject.chemistry.name': 'ರಸಾಯನಶಾಸ್ತ್ರ',
    'subject.chemistry.title': 'pH ಬಣ್ಣದ ಪ್ರಯೋಗಾಲಯ',
    'subject.chemistry.desc': 'ನೈಸರ್ಗಿಕ ಸೂಚಕಗಳನ್ನು ಬಳಸಿ ಆಮ್ಲ, ತಟಸ್ಥ ಮತ್ತು ಪ್ರತ್ಯಾಮ್ಲಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.',
    'subject.chemistry.standard': 'NCERT 7 ನೇ ತರಗತಿ ವಿಜ್ಞಾನ ಅಧ್ಯಾಯ 5',

    // Predictions (Kannada)
    'math.pred.prompt': 'ಒಂದು ನೀರಿನ ತೊಟ್ಟಿಯಲ್ಲಿ 12 ಯೂನಿಟ್ ನೀರಿದ್ದು, ಮೂರು ಜಮೀನುಗಳಿಗೆ 1 : 2 : 3 ಅನುಪಾತದಲ್ಲಿ ಹಂಚಬೇಕಾಗಿದೆ. ಅತಿ ದೊಡ್ಡ ಜಮೀನು (Plot C) ಎಷ್ಟು ಯೂನಿಟ್ ನೀರನ್ನು ಪಡೆಯಬೇಕು?',
    'math.pred.opt_a': '3 ಯೂನಿಟ್',
    'math.pred.opt_b': '4 ಯೂನಿಟ್',
    'math.pred.opt_c': '6 ಯೂನಿಟ್',

    'bio.pred.prompt': 'ನಮ್ಮ ಹೊಲದ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ, ರೈತರು ಎಲ್ಲಾ ಹಾವುಗಳನ್ನು ಹೊಲದಿಂದ ತೆಗೆದುಹಾಕಿದರೆ ಮಿಡತೆಗಳ (grasshoppers) ಸಂಖ್ಯೆಗೆ ಏನಾಗಬಹುದು?',
    'bio.pred.opt_a': 'ಮಿಡತೆಗಳ ಸಂಖ್ಯೆ ಕಡಿಮೆಯಾಗುತ್ತದೆ',
    'bio.pred.opt_b': 'ಮಿಡತೆಗಳ ಸಂಖ್ಯೆ ಹೆಚ್ಚಾಗುತ್ತದೆ',
    'bio.pred.opt_c': 'ಮಿಡತೆಗಳ ಸಂಖ್ಯೆಯಲ್ಲಿ ಯಾವುದೇ ಬದಲಾವಣೆ ಆಗುವುದಿಲ್ಲ',

    'chem.pred.prompt': 'ಅರಿಶಿನವು ಒಂದು ನೈಸರ್ಗಿಕ ಹಳದಿ ಸೂಚಕವಾಗಿದೆ. ಪ್ರತ್ಯಾಮ್ಲೀಯವಾಗಿರುವ (basic) ಬಟ್ಟೆ ಸೋಪಿಗೆ ಅರಿಶಿನ ತಾಗಿಸಿದಾಗ ಅದು ಯಾವ ಬಣ್ಣಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ?',
    'chem.pred.opt_a': 'ಪ್ರಕಾಶಮಾನ ನೀಲಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತದೆ',
    'chem.pred.opt_b': 'ಕೆಂಪು-ಕಂದು ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತದೆ',
    'chem.pred.opt_c': 'ಹಳದಿ ಬಣ್ಣದಲ್ಲೇ ಉಳಿಯುತ್ತದೆ',

    'phys.pred.prompt': 'ಒಬ್ಬ ಸಂಗೀತಗಾರನು 220 Hz ಬದಲು 440 Hz ನಲ್ಲಿ ಧ್ವನಿಯನ್ನು ನುಡಿಸಿದರೆ, ನೀವು ಕೇಳುವ ಧ್ವನಿಯಲ್ಲಿ ಏನು ವ್ಯತ್ಯಾಸವಾಗುತ್ತದೆ?',
    'phys.pred.opt_a': 'ಶೃತಿ (pitch) ಹೆಚ್ಚಾಗುತ್ತದೆ (ಕೀರಲು ಧ್ವನಿ)',
    'phys.pred.opt_b': 'ಧ್ವನಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಜೋರಾಗುತ್ತದೆ',
    'phys.pred.opt_c': 'ಧ್ವನಿ ತರಂಗವು ಕೋಣೆಯಲ್ಲಿ ಎರಡು ಪಟ್ಟು ವೇಗವಾಗಿ ಚಲಿಸುತ್ತದೆ',

    // Retries (Kannada)
    'math.retry.prompt': 'ಹೊಸ ತೊಟ್ಟಿಯಲ್ಲಿ 18 ಯೂನಿಟ್ ನೀರಿದೆ. ಅದನ್ನು ಎರಡು ಜಮೀನುಗಳಿಗೆ 1 : 2 ಅನುಪಾತದಲ್ಲಿ ಹಂಚಿದರೆ, Plot Y ಗೆ ಎಷ್ಟು ಯೂನಿಟ್ ನೀರು ಸಿಗುತ್ತದೆ?',
    'math.retry.opt_a': '6 ಯೂನಿಟ್',
    'math.retry.opt_b': '12 ಯೂನಿಟ್',
    'math.retry.opt_c': '9 ಯೂನಿಟ್',

    'bio.retry.prompt': 'ರೋಗದಿಂದಾಗಿ ಹೊಲದ ಇಲಿಗಳ ಸಂಖ್ಯೆ ಕಡಿಮೆಯಾದರೆ, ಯಾವ ಪ್ರಾಣಿಗೆ ನೇರ ಆಹಾರದ ಕೊರತೆ ಉಂಟಾಗುತ್ತದೆ?',
    'bio.retry.opt_a': 'ಮಿಡತೆಗಳು',
    'bio.retry.opt_b': 'ಗೂಬೆಗಳು',
    'bio.retry.opt_c': 'ಕಪ್ಪೆಗಳು',

    'chem.retry.prompt': 'ವಿನೆಗರ್ ದ್ರಾವಣದ pH ಮೌಲ್ಯ 3 ಆಗಿದೆ. ವಿನೆಗರ್ ಯಾವ ಗುಂಪಿಗೆ ಸೇರುತ್ತದೆ?',
    'chem.retry.opt_a': 'ಆಮ್ಲೀಯ (pH < 7)',
    'chem.retry.opt_b': 'ತಟಸ್ಥ (pH = 7)',
    'chem.retry.opt_c': 'ಪ್ರತ್ಯಾಮ್ಲೀಯ (pH > 7)',

    'phys.retry.prompt': 'ಎರಡು ಧ್ವನಿ ತರಂಗಗಳು ಒಂದೇ ಎತ್ತರವನ್ನು ಹೊಂದಿವೆ, ಆದರೆ 2 ನೇ ತರಂಗವು 1 ನೇ ತರಂಗಕ್ಕಿಂತ ಪ್ರತಿ ಸೆಕೆಂಡಿಗೆ ಎರಡು ಪಟ್ಟು ಹೆಚ್ಚು ತರಂಗಗಳನ್ನು ಹೊಂದಿದೆ. 2 ನೇ ತರಂಗ ಹೇಗೆ ಕೇಳಿಸುತ್ತದೆ?',
    'phys.retry.opt_a': 'ಇದು ಜೋರಾಗಿರುತ್ತದೆ',
    'phys.retry.opt_b': 'ಇದು ಹೆಚ್ಚಿನ ಶೃತಿಯನ್ನು (pitch) ಹೊಂದಿದೆ',
    'phys.retry.opt_c': 'ಇದು ವೇಗವಾಗಿ ಚಲಿಸುತ್ತದೆ',

    // Badges (Kannada)
    'badge.math.name': 'ಜಲ ಮಿತ್ರ (Water Guardian)',
    'badge.bio.name': 'ಪ್ರಕೃತಿ ರಕ್ಷಕ (Ecosystem Guardian)',
    'badge.chem.name': 'ರಸಾಯನ ಶೋಧಕ (Chemistry Pioneer)',
    'badge.phys.name': 'ಧ್ವನಿ ಪರೀಕ್ಷಕ (Sound Detective)'
  }
};

/**
 * Translates a key according to the active locale with automatic fallback to English.
 * Supports placeholder interpolation, e.g. `{score}`, `{total}`, `{title}`.
 *
 * @param {string} key Localization dictionary key
 * @param {Record<string, string|number>} [params={}] Key-value map for string interpolation
 * @returns {string} Localized string or key itself if unfound
 */
export function t(key, params = {}) {
  if (!key || typeof key !== 'string') return '';

  const activeLocale = store ? store.getState().selectedLocale : DEFAULT_LOCALE;

  let text = '';
  // Try selected locale first
  if (DICTIONARY[activeLocale] && DICTIONARY[activeLocale][key]) {
    text = DICTIONARY[activeLocale][key];
  }

  // Fallback to English if missing or empty string
  if (!text && DICTIONARY.en && DICTIONARY.en[key]) {
    text = DICTIONARY.en[key];
  }

  // If still unfound, return key itself
  if (!text) {
    text = key;
  }

  // Parameter replacement
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((paramKey) => {
      const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
      text = text.replace(regex, String(params[paramKey]));
    });
  }

  return text;
}

/**
 * Returns current locale code ('en' or 'kn').
 * @returns {'en'|'kn'}
 */
export function getCurrentLocale() {
  return store ? store.getState().selectedLocale : DEFAULT_LOCALE;
}
