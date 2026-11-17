# STEM for Impact 2026 Hackathon — Research Workspace Index

**Welcome Team!** This dedicated research workspace contains exhaustive background research, empirical evidence, open-source repository audits, competitive analysis, and strategic concept evaluations for the **STEM for Impact 2026 Hackathon**.

> **Important Hackathon Rule Reminder:**  
> Solutions must focus on improving K–12 STEM learning in rural and underserved communities, pick **one core STEM subject** (Math, Biology, Chemistry, or Physics), and be developed primarily during the 24-hour hackathon.  
> *No final concept has been prematurely locked or implemented.*

---

## Research Reports Overview

1. **[01_learning_science_dossier.md](./01_learning_science_dossier.md)**
   * Rigorous synthesis of empirical learning science: retrieval practice (Dunlosky et al., $g \approx 0.50-0.73$), formative feedback (Wisniewski, Hattie et al., $d = 0.48$), interactive simulations (Smetana & Bell), gamification reality checks (Sailer & Homner, cognitive $g = 0.49$ vs. competitive demotivation), and adaptive instruction in India (Muralidharan, Singh, & Ganimian, $0.37\sigma$ math gain).

2. **[02_open_source_ecosystem_audit.md](./02_open_source_ecosystem_audit.md)**
   * In-depth audit of real GitHub repositories:
     * `phetsims` (CC BY-NC 4.0 HTML sims vs. Scenery source build complexity)
     * `learningequality/kolibri` (MIT offline LMS architecture vs. 24h build friction)
     * `phyphox` (GPL-3.0 sensor experiments vs. Web Sensor APIs)
     * `mathigon` (MIT `euclid.js` & `fermat.js` 2D geometry engines)
     * `oppia/oppia` & `kiwix/kiwix-js`
   * Precise boundaries detailing what can be directly reused vs. what should serve only as architectural inspiration.

3. **[03_existing_products_landscape.md](./03_existing_products_landscape.md)**
   * Competitive evaluation of Mindspark, PhET, Khan Academy, Labster/PraxiLabs, DIKSHA, and CircuitVerse.
   * Identification of unserved sweet spots: bridging the chasm between passive video streaming (low retention) and heavy 3D WebGL (incompatible with low-cost hardware).

4. **[04_indian_educational_context.md](./04_indian_educational_context.md)**
   * Official government and field data (UDISE+ 2023–24, ASER 2023 "Beyond Basics", ASER 2024, NEP 2020, NCF-SE 2023).
   * Ground facts (UDISE+ 2024–25 Table 7.23 / ASER 2023): Integrated science labs reported available in 57.1% of schools with secondary sections across all managements and 51.7% of government secondary sections (48.3% lack dedicated lab); internet facility available in 58.6% of government schools; 56.7% of rural adolescents struggle with 3-digit division.
   * Technical design targets: Lean bundle target (<2MB), offline PWA with service worker caching, anonymous single learner session, and vernacular copy.

5. **[05_candidate_concepts_and_decision_framework.md](./05_candidate_concepts_and_decision_framework.md)**
   * Five distinct candidate solution directions:
     * **Concept A:** *Gramin PocketLab* (Smartphone Sensor Physical Science Lab — Physics)
     * **Concept B:** *KisanGanit* (Agri-Numeracy & Livelihood Math Engine — Mathematics)
     * **Concept C:** *Jal-Chakra & BioScope* (Interactive Rural Ecology Simulator — Biology/Chemistry)
     * **Concept D:** *VidyutSetu* (Offline Virtual Circuit & Solar Tinkering Sandbox — Physics)
     * **Concept E:** *PrashnaSaathi* (Vernacular Socratic Voice-Tutor — Cross-Disciplinary)
   * Weighted decision matrix scoring each concept across pedagogy, offline viability, 24h feasibility, and hackathon "wow" factor.
   * Compliance checks (licensing, child data privacy under DPDP Act 2023, safety guidelines).
   * Master Source Register and unresolved team decision points.

---

## Hackathon Hub Reference
* **Notion Project Hub:** [https://app.notion.com/p/3fc4f16bd21080a79818cec75aedbcac](https://app.notion.com/p/3fc4f16bd21080a79818cec75aedbcac)
