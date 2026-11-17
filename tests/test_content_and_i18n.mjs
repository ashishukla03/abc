/**
 * Gramin PocketLab — Automated Verification Suite
 * Suite 2: test_content_and_i18n.mjs
 *
 * Verifies:
 * 1. All i18n keys resolve without undefined values.
 * 2. English fallback when locale is 'kn' and key is missing in Kannada dictionary.
 * 3. missions_data.js structure: all 4 subjects present, prediction questions, options, retry questions, exit questions.
 * 4. Validates Chemistry content: Lemon Juice pH ~2.2, Distilled Water pH 7.0, Baking Soda pH ~8.5, Soap pH ~10.0, Natural Turmeric Paper, Universal Indicator Paper, and the exact pathogen potability disclaimer.
 * 5. Confirms word "cysts" is NOT present anywhere in content files.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Establish mock browser environment before module import
const mockWindow = {
  localStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {}
  },
  location: { hash: '#/map' },
  addEventListener() {},
  removeEventListener() {}
};
globalThis.window = mockWindow;

const { store } = await import('../app/js/store.js');
const { DICTIONARY, t: translate, getCurrentLocale, SUPPORTED_LOCALES } = await import('../app/content/i18n.js');
const { MISSIONS, getAllMissions, getMission } = await import('../app/content/missions_data.js');
const { ChemistryModule } = await import('../app/modules/chemistry_stub.js');

test('Suite 2: Content & Internationalization (i18n) Verification', async (suite) => {
  await suite.test('1. i18n Dictionary Integrity & No Undefined Values', () => {
    assert.ok(DICTIONARY.en, 'English dictionary must exist');
    assert.ok(DICTIONARY.kn, 'Kannada dictionary must exist');

    const enKeys = Object.keys(DICTIONARY.en);
    assert.ok(enKeys.length > 50, `English dictionary should have comprehensive keys, found: ${enKeys.length}`);

    // Verify no key has undefined or null value in English
    enKeys.forEach((key) => {
      const val = DICTIONARY.en[key];
      assert.notEqual(val, undefined, `Key "${key}" has undefined value in en`);
      assert.notEqual(val, null, `Key "${key}" has null value in en`);
      assert.equal(typeof val, 'string', `Key "${key}" must be a string in en`);
      assert.ok(val.trim().length > 0, `Key "${key}" must not be empty whitespace in en`);
    });

    // Verify all Kannada keys also have valid non-empty string values
    Object.keys(DICTIONARY.kn).forEach((key) => {
      const val = DICTIONARY.kn[key];
      assert.notEqual(val, undefined, `Key "${key}" has undefined value in kn`);
      assert.notEqual(val, null, `Key "${key}" has null value in kn`);
      assert.equal(typeof val, 'string', `Key "${key}" must be a string in kn`);
      assert.ok(val.trim().length > 0, `Key "${key}" must not be empty whitespace in kn`);
    });
  });

  await suite.test('2. English Fallback when Locale is "kn" and Key is Missing in Kannada', () => {
    store.setLocale('kn');
    assert.equal(getCurrentLocale(), 'kn');

    // Test a key present in both
    const knObserved = translate('btn.back');
    assert.equal(knObserved, '← ಹಿಂದಕ್ಕೆ', 'Direct Kannada translation should be used when present');

    // Test a key present in EN but deliberately absent in KN
    const testFallbackKey = 'test.synthetic_fallback_key';
    DICTIONARY.en[testFallbackKey] = 'Universal Fallback Text';
    delete DICTIONARY.kn[testFallbackKey];

    const fallbackResult = translate(testFallbackKey);
    assert.equal(fallbackResult, 'Universal Fallback Text', 'Must fallback to English when key missing in Kannada');

    // Clean up synthetic key
    delete DICTIONARY.en[testFallbackKey];

    // Restore locale
    store.setLocale('en');
  });

  await suite.test('3. Parameter Interpolation in translate(key, params)', () => {
    store.setLocale('en');
    const formatted = translate('map.progress_summary', { completed: 3 });
    assert.equal(formatted, '3 of 4 Missions Completed');

    const formattedScore = translate('s6.score_text', { score: 2 });
    assert.equal(formattedScore, 'Exit Check Score: 2 / 2 Correct');
  });

  await suite.test('4. missions_data.js Structural Validation: All 4 Subjects Present', () => {
    const expectedSubjects = ['physics', 'math', 'biology', 'chemistry'];
    const missions = getAllMissions();

    assert.equal(missions.length, 4, 'Exactly 4 STEM missions must be registered');

    expectedSubjects.forEach((subjectId) => {
      const m = getMission(subjectId);
      assert.ok(m, `Mission for subject "${subjectId}" must exist`);
      assert.equal(m.subjectId, subjectId);

      // Verify metadata keys exist and resolve in i18n
      assert.ok(m.titleKey, `${subjectId} missing titleKey`);
      assert.ok(translate(m.titleKey).length > 0, `${subjectId} titleKey does not resolve`);
      assert.ok(m.scopeSummaryKey, `${subjectId} missing scopeSummaryKey`);
      assert.ok(translate(m.scopeSummaryKey).length > 0, `${subjectId} scopeSummaryKey does not resolve`);
      assert.ok(m.curriculumStandard, `${subjectId} missing curriculumStandard`);

      // S1 Intro
      assert.ok(m.introScenarioKey, `${subjectId} missing introScenarioKey`);
      assert.ok(translate(m.introScenarioKey).length > 0, `${subjectId} introScenarioKey does not resolve`);
      assert.ok(m.learningObjectiveKey, `${subjectId} missing learningObjectiveKey`);
      assert.ok(translate(m.learningObjectiveKey).length > 0, `${subjectId} learningObjectiveKey does not resolve`);

      // S2 Prediction
      const pred = m.predictionQuestion;
      assert.ok(pred, `${subjectId} missing predictionQuestion`);
      assert.ok(pred.promptKey, `${subjectId} missing pred.promptKey`);
      assert.ok(translate(pred.promptKey).length > 0, `${subjectId} pred.promptKey does not resolve`);
      assert.ok(Array.isArray(pred.options) && pred.options.length >= 3, `${subjectId} predictionQuestion must have >= 3 options`);
      const correctPreds = pred.options.filter(o => o.isCorrect);
      assert.equal(correctPreds.length, 1, `${subjectId} predictionQuestion must have exactly 1 correct option`);
      pred.options.forEach(opt => {
        assert.ok(opt.id, `${subjectId} prediction option missing id`);
        assert.ok(opt.labelKey, `${subjectId} prediction option missing labelKey`);
        assert.ok(translate(opt.labelKey).length > 0, `${subjectId} prediction option labelKey does not resolve: ${opt.labelKey}`);
      });
      assert.ok(pred.explanationKey, `${subjectId} prediction missing explanationKey`);
      assert.ok(translate(pred.explanationKey).length > 0, `${subjectId} pred.explanationKey does not resolve`);

      // S3 Interaction handler binding
      assert.ok(m.interactionHandler, `${subjectId} missing interactionHandler`);
      assert.equal(typeof m.interactionHandler.getInitialState, 'function');
      assert.equal(typeof m.interactionHandler.validateInvariant, 'function');
      assert.equal(typeof m.interactionHandler.resetState, 'function');
      assert.equal(typeof m.interactionHandler.mount, 'function');

      // S4 Concept Explanation keys
      assert.ok(m.conceptExplanationKeys, `${subjectId} missing conceptExplanationKeys`);
      assert.ok(translate(m.conceptExplanationKeys.observedKey).length > 0, `${subjectId} observedKey does not resolve`);
      assert.ok(Array.isArray(m.conceptExplanationKeys.paragraphsKeys) && m.conceptExplanationKeys.paragraphsKeys.length >= 2);
      m.conceptExplanationKeys.paragraphsKeys.forEach(pk => {
        assert.ok(translate(pk).length > 0, `${subjectId} paragraphKey does not resolve: ${pk}`);
      });
      assert.ok(translate(m.conceptExplanationKeys.ruleBoxKey).length > 0, `${subjectId} ruleBoxKey does not resolve`);

      // S5 Formative diagnostic check
      const formQ = m.formativeCheckQuestion;
      assert.ok(formQ, `${subjectId} missing formativeCheckQuestion`);
      assert.ok(translate(formQ.promptKey).length > 0);
      assert.ok(Array.isArray(formQ.options) && formQ.options.length >= 3);
      assert.equal(formQ.options.filter(o => o.isCorrect).length, 1);
      assert.ok(translate(formQ.explanationKey).length > 0);

      // S5 Changed Retry question
      const retryQ = m.retryQuestion;
      assert.ok(retryQ, `${subjectId} missing retryQuestion`);
      assert.notEqual(retryQ.promptKey, formQ.promptKey, `${subjectId} retry question prompt must be CHANGED from diagnostic`);
      assert.ok(translate(retryQ.promptKey).length > 0);
      assert.ok(Array.isArray(retryQ.options) && retryQ.options.length >= 3);
      assert.equal(retryQ.options.filter(o => o.isCorrect).length, 1);
      assert.ok(translate(retryQ.explanationKey).length > 0);

      // S6 Exit check questions (exactly 2)
      assert.ok(Array.isArray(m.exitCheckQuestions) && m.exitCheckQuestions.length === 2, `${subjectId} must have exactly 2 exitCheckQuestions`);
      m.exitCheckQuestions.forEach((eq, idx) => {
        assert.ok(translate(eq.promptKey).length > 0, `${subjectId} exitQ[${idx}] prompt does not resolve`);
        assert.ok(Array.isArray(eq.options) && eq.options.length >= 3, `${subjectId} exitQ[${idx}] must have >= 3 options`);
        assert.equal(eq.options.filter(o => o.isCorrect).length, 1, `${subjectId} exitQ[${idx}] must have exactly 1 correct option`);
        assert.ok(translate(eq.explanationKey).length > 0, `${subjectId} exitQ[${idx}] explanation does not resolve`);
      });

      // Mastery Badge
      assert.ok(m.masteryBadge, `${subjectId} missing masteryBadge`);
      assert.ok(translate(m.masteryBadge.nameKey).length > 0);
      assert.ok(translate(m.masteryBadge.descKey).length > 0);
    });
  });

  await suite.test('5. Chemistry Content: pH Values, Indicators & Reagents', () => {
    // Inspect ChemistryModule implementation
    const chemState = ChemistryModule.getInitialState();
    assert.deepEqual(chemState, {
      selectedSample: 'distilled_water',
      selectedIndicator: 'universal',
      hasTested: false
    });

    // Helper mock element
    function createMockElement() {
      return {
        style: {},
        textContent: '',
        className: '',
        dataset: {},
        addEventListener() {},
        querySelector() { return createMockElement(); },
        querySelectorAll() { return []; }
      };
    }

    const mockContainer = {
      innerHTML: '',
      querySelector() { return createMockElement(); },
      querySelectorAll() { return [createMockElement()]; }
    };

    ChemistryModule.mount(mockContainer, chemState, () => {});
    const html = mockContainer.innerHTML;

    // Verify 4 standardized beakers & household solutions
    assert.ok(html.includes('Lemon Juice'), 'Chemistry must contain Lemon Juice');
    assert.ok(html.includes('Distilled Water'), 'Chemistry must contain Distilled Water');
    assert.ok(html.includes('Baking Soda'), 'Chemistry must contain Baking Soda');
    assert.ok(html.includes('Soap'), 'Chemistry must contain Soap');

    // Verify Indicators
    assert.ok(html.includes('Natural Turmeric Paper'), 'Chemistry must feature Natural Turmeric Paper');
    assert.ok(html.includes('Universal Indicator Paper'), 'Chemistry must feature Universal Indicator Paper');

    // Verify Chemistry source code specifications directly
    const chemCode = fs.readFileSync(path.resolve('./app/modules/chemistry_stub.js'), 'utf-8');

    // pH value validations:
    // Lemon Juice pH ~2.2
    assert.match(chemCode, /lemon_juice:[\s\S]*?ph:\s*2\.2/, 'Lemon juice pH must be calibrated to ~2.2');
    // Distilled Water pH 7.0
    assert.match(chemCode, /distilled_water:[\s\S]*?ph:\s*7\.0/, 'Distilled water pH must be 7.0');
    // Baking Soda pH ~8.5
    assert.match(chemCode, /baking_soda:[\s\S]*?ph:\s*8\.5/, 'Baking soda pH must be ~8.5');
    // Laundry Soap pH ~10.0
    assert.match(chemCode, /laundry_soap:[\s\S]*?ph:\s*10\.0/, 'Laundry soap pH must be ~10.0');
  });

  await suite.test('6. Mandatory Water Potability & Pathogen Disclaimer Exact Text', () => {
    const rawExpectedText = 'A pH test measures hydrogen ion activity; it does not detect pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals. A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety.';

    const i18nDisclaimer = DICTIONARY.en['chem.safety_disclaimer'];
    assert.ok(i18nDisclaimer, 'chem.safety_disclaimer must exist in i18n dictionary');
    assert.ok(i18nDisclaimer.includes(rawExpectedText),
      `i18n chem.safety_disclaimer must contain exact pathogen potability statement. Found: "${i18nDisclaimer}"`);

    // Verify module mount template contains the disclaimer (accounting for optional <em> tags)
    const chemCode = fs.readFileSync(path.resolve('./app/modules/chemistry_stub.js'), 'utf-8');
    const sanitizedChemCode = chemCode.replace(/<[^>]+>/g, ' ');
    assert.ok(sanitizedChemCode.includes('A pH test measures hydrogen ion activity'),
      'ChemistryModule mount template must contain hydrogen ion statement');
    assert.ok(sanitizedChemCode.includes('pathogens (bacteria, viruses, or protozoa) or toxic dissolved chemicals'),
      'ChemistryModule mount template must contain exact pathogen parenthetical without cysts');
    assert.ok(sanitizedChemCode.includes('A neutral reading of pH 7.0 does NOT establish water potability or biological drinking safety'),
      'ChemistryModule mount template must contain exact potability statement');
  });

  await suite.test('7. Strict Prohibition Verification: Word "cysts" is NOT present anywhere in content', () => {
    const filesToScan = [
      './app/content/i18n.js',
      './app/content/missions_data.js',
      './app/modules/chemistry_stub.js',
      './app/modules/biology_stub.js',
      './app/modules/physics.js',
      './app/modules/math_stub.js',
      './app/engine/learning_runner.js'
    ];

    filesToScan.forEach((relPath) => {
      const fullPath = path.resolve(relPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const matches = content.match(/\bcysts\b/gi);
      assert.equal(matches, null, `Prohibited word "cysts" found in ${relPath}`);
    });
  });
});
