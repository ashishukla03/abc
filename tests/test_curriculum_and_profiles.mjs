/**
 * Gramin PocketLab — Automated Verification Suite
 * Suite 11: test_curriculum_and_profiles.mjs
 *
 * Verifies:
 * 1. Curriculum Authority & Route Resolution (CBSE, CISCE with ICSE/ISC separation, State Boards).
 * 2. Dynamic Subject & Course Resolution based on Board, Grade, Stream, and Medium.
 * 3. Chapter Node & Topic Node Taxonomy Integrity.
 * 4. Multi-Profile Account Sandbox & Isolation on a shared device.
 * 5. Guardian Consent Flagging and Privacy Verification.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

// Mock browser environment for store
class MockLocalStorage {
  constructor() { this.store = new Map(); }
  getItem(key) { return this.store.get(key) || null; }
  setItem(key, val) { this.store.set(key, String(val)); }
  removeItem(key) { this.store.delete(key); }
  clear() { this.store.clear(); }
}

globalThis.window = {
  localStorage: new MockLocalStorage(),
  location: { hash: '#/map' },
  addEventListener: () => {},
  removeEventListener: () => {}
};

const { store } = await import('../app/js/store.js');
const { resolveCurriculum, getSubjectChapterTaxonomy, CURRICULUM_AUTHORITIES } = await import('../app/content/curriculum_registry.js');

test('Suite 11: Curriculum Registry & Multi-Profile Sandboxing', async (t) => {

  await t.test('1. Curriculum Authority Registry Integrity', () => {
    assert.ok(CURRICULUM_AUTHORITIES.cbse, 'CBSE authority must exist');
    assert.ok(CURRICULUM_AUTHORITIES.cisce, 'CISCE authority must exist');
    assert.ok(CURRICULUM_AUTHORITIES.kseab, 'KSEAB authority must exist');
    assert.equal(CURRICULUM_AUTHORITIES.cbse.jurisdiction, 'National / All India');
    assert.equal(CURRICULUM_AUTHORITIES.kseab.jurisdiction, 'Karnataka');
  });

  await t.test('2. CISCE Distinguishes ICSE and ISC Examination Routes', () => {
    const icseRes = resolveCurriculum('cisce', 10, 'English');
    assert.equal(icseRes.examRoute, 'ICSE', 'Class 10 CISCE must be ICSE route');
    assert.equal(icseRes.stage, 'secondary');

    const iscRes = resolveCurriculum('cisce', 12, 'English');
    assert.equal(iscRes.examRoute, 'ISC', 'Class 12 CISCE must be ISC route');
    assert.equal(iscRes.stage, 'senior');
  });

  await t.test('3. Dynamic Subject Resolution by Board and Class', () => {
    const cbse7 = resolveCurriculum('cbse', 7, 'English');
    assert.equal(cbse7.stage, 'middle');
    assert.ok(cbse7.subjects.length >= 4, 'Class 7 must have at least 4 core subjects');
    assert.ok(cbse7.subjects.some(s => s.id === 'physics'), 'CBSE Class 7 must include physics');

    const cbse12 = resolveCurriculum('cbse', 12, 'English');
    assert.equal(cbse12.stage, 'senior');
    assert.ok(cbse12.subjects.some(s => s.id === 'math_12'), 'CBSE Class 12 must include mathematics');
  });

  await t.test('4. Detailed Chapter Taxonomy & Learning Outcomes', () => {
    const units = getSubjectChapterTaxonomy('cbse-7-science');
    assert.ok(units.length >= 3, 'Must have at least 3 overarching units');
    
    const physicalUnit = units.find(u => u.unitId === 'u1-physical');
    assert.ok(physicalUnit, 'Physical phenomena unit must exist');

    const heatChapter = physicalUnit.chapters.find(c => c.number === 4);
    assert.ok(heatChapter, 'Chapter 4 Heat must exist');
    assert.ok(heatChapter.topics.length >= 2, 'Chapter 4 must have structured topics');
    assert.ok(heatChapter.topics[0].outcomes.length >= 1, 'Topic must define explicit learning outcomes');
  });

  await t.test('5. Multi-Profile Creation and Data Isolation', () => {
    // Initial profile
    const initialProfiles = store.getProfiles();
    assert.ok(initialProfiles.length >= 1, 'Initial profile should exist');

    // Create Sibling Profile
    const priyaId = store.createProfile({
      name: 'Priya Sharma',
      board: 'KSEAB',
      classLevel: 5,
      section: 'A',
      avatar: '👩‍🎓',
      guardianConsentGranted: true
    });

    assert.ok(priyaId, 'New profile ID must be returned');
    const statePriya = store.getState();
    assert.equal(statePriya.activeProfileId, priyaId);
    assert.equal(statePriya.learnerProfile.name, 'Priya Sharma');
    assert.equal(statePriya.selectedBoard, 'KSEAB');
    assert.equal(statePriya.selectedClass, 5);
    assert.equal(statePriya.gradeBand, 'preparatory');

    // Verify progress isolation: Priya starts with 0 completed
    assert.equal(statePriya.progress.physics.isCompleted, false);

    // Switch back to Aarav
    const aaravId = initialProfiles[0].id;
    store.switchProfile(aaravId);
    const stateAarav = store.getState();
    assert.equal(stateAarav.activeProfileId, aaravId);
    assert.equal(stateAarav.learnerProfile.name, 'Aarav Sharma');
    assert.equal(stateAarav.selectedClass, 7);
    assert.equal(stateAarav.gradeBand, 'middle');
  });

  await t.test('6. Guardian Consent Flagging', () => {
    const profiles = store.getProfiles();
    const testId = profiles[0].id;
    store.grantGuardianConsent(testId);
    const state = store.getState();
    assert.equal(state.learnerProfile.guardianConsent.granted, true);
    assert.equal(state.learnerProfile.guardianConsent.relationship, 'parent_guardian');
  });
});

