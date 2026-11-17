/**
 * Gramin PocketLab — Multi-Board K-12 Curriculum Registry
 * File: app/content/curriculum_registry.js
 *
 * Comprehensive curriculum ontology representing:
 * 1. CBSE (Central Board of Secondary Education)
 * 2. CISCE with distinct examination routes:
 *    - ICSE (Indian Certificate of Secondary Education - Classes IX-X)
 *    - ISC (Indian School Certificate - Classes XI-XII)
 * 3. State & UT Education Authorities:
 *    - KSEAB (Karnataka School Examination and Assessment Board)
 *    - MSBSHSE (Maharashtra State Board)
 *    - TNDGE (Tamil Nadu Directorate of Government Examinations)
 *    - UPMSP (Uttar Pradesh Madhyamik Shiksha Parishad)
 *    - WBBSE/WBCHSE (West Bengal Boards)
 *
 * Strict hierarchical structure:
 * Authority -> Route -> Grade/Class -> Stream -> Subject -> Course/Textbook -> Unit -> Chapter -> Topic
 */

export const CURRICULUM_AUTHORITIES = {
  cbse: {
    id: 'cbse',
    name: 'CBSE',
    fullName: 'Central Board of Secondary Education',
    jurisdiction: 'National / All India',
    routes: ['general', 'secondary', 'senior_secondary'],
    supportedClasses: [5, 6, 7, 8, 9, 10, 11, 12],
    supportedMediums: ['English', 'Hindi'],
    academicSession: '2026-2027',
    textbookAuthority: 'NCERT'
  },
  cisce: {
    id: 'cisce',
    name: 'CISCE',
    fullName: 'Council for the Indian School Certificate Examinations',
    jurisdiction: 'National / Private Affiliated',
    routes: ['middle', 'icse', 'isc'],
    supportedClasses: [5, 6, 7, 8, 9, 10, 11, 12],
    supportedMediums: ['English'],
    academicSession: '2026-2027',
    textbookAuthority: 'CISCE Prescribed / Frank Bros / Selina'
  },
  kseab: {
    id: 'kseab',
    name: 'KSEAB',
    fullName: 'Karnataka School Examination and Assessment Board',
    jurisdiction: 'Karnataka',
    routes: ['primary', 'higher_primary', 'sslc', 'puc'],
    supportedClasses: [5, 6, 7, 8, 9, 10, 11, 12],
    supportedMediums: ['Kannada', 'English'],
    academicSession: '2026-2027',
    textbookAuthority: 'DSERT Karnataka / NCERT Adapted'
  },
  msbshse: {
    id: 'msbshse',
    name: 'MSBSHSE',
    fullName: 'Maharashtra State Board of Secondary and Higher Secondary Education',
    jurisdiction: 'Maharashtra',
    routes: ['primary', 'upper_primary', 'ssc', 'hsc'],
    supportedClasses: [5, 6, 7, 8, 9, 10, 11, 12],
    supportedMediums: ['Marathi', 'English'],
    academicSession: '2026-2027',
    textbookAuthority: 'Balbharati'
  },
  tndge: {
    id: 'tndge',
    name: 'TNDGE',
    fullName: 'Tamil Nadu Directorate of Government Examinations',
    jurisdiction: 'Tamil Nadu',
    routes: ['primary', 'middle', 'sslc', 'hsc'],
    supportedClasses: [5, 6, 7, 8, 9, 10, 11, 12],
    supportedMediums: ['Tamil', 'English'],
    academicSession: '2026-2027',
    textbookAuthority: 'Tamil Nadu Textbook Corporation (TNSCERT)'
  }
};

/**
 * Subject catalog mapped dynamically by authority, class, stream, and medium.
 */
export const BOARD_CURRICULUM_DATA = {
  // CBSE Curriculum
  cbse: {
    5: {
      stage: 'preparatory',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'math', name: 'Mathematics', book: 'Math-Magic Class 5', code: '041', units: 14 },
        { id: 'evs', name: 'Environmental Studies', book: 'Looking Around Class 5', code: '086', units: 22 },
        { id: 'english', name: 'English', book: 'Marigold Class 5', code: '184', units: 10 },
        { id: 'hindi', name: 'Hindi', book: 'Rimjhim Class 5', code: '002', units: 18 }
      ]
    },
    6: {
      stage: 'middle',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'science', name: 'Science', book: 'Science Class 6 (NCERT)', code: '086', units: 11 },
        { id: 'math', name: 'Mathematics', book: 'Mathematics Class 6 (NCERT)', code: '041', units: 12 },
        { id: 'social', name: 'Social Science', book: 'Our Pasts I & Earth Our Habitat', code: '087', units: 16 },
        { id: 'english', name: 'English', book: 'Honeysuckle Class 6', code: '184', units: 8 },
        { id: 'hindi', name: 'Hindi', book: 'Vasant Part 1', code: '002', units: 12 }
      ]
    },
    7: {
      stage: 'middle',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'physics', name: 'Physics & Physical Science', book: 'Science Class 7 (NCERT)', code: '086', units: 4 },
        { id: 'chemistry', name: 'Chemistry & Matter', book: 'Science Class 7 (NCERT)', code: '086', units: 4 },
        { id: 'biology', name: 'Biology & Life Systems', book: 'Science Class 7 (NCERT)', code: '086', units: 5 },
        { id: 'math', name: 'Mathematics', book: 'Mathematics Class 7 (NCERT)', code: '041', units: 13 },
        { id: 'social', name: 'Social Science', book: 'Our Pasts II & Our Environment', code: '087', units: 18 },
        { id: 'english', name: 'English', book: 'Honeycomb Class 7', code: '184', units: 10 },
        { id: 'computing', name: 'Computer Applications', book: 'Information Technology Basics', code: '165', units: 6 }
      ]
    },
    8: {
      stage: 'middle',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'physics', name: 'Physics (Sound, Light, Force)', book: 'Science Class 8 (NCERT)', code: '086', units: 5 },
        { id: 'chemistry', name: 'Chemistry (Metals, Combustion)', book: 'Science Class 8 (NCERT)', code: '086', units: 4 },
        { id: 'biology', name: 'Biology (Cell, Reproduction)', book: 'Science Class 8 (NCERT)', code: '086', units: 4 },
        { id: 'math', name: 'Mathematics', book: 'Mathematics Class 8 (NCERT)', code: '041', units: 14 },
        { id: 'social', name: 'Social Science', book: 'Resources & Development', code: '087', units: 16 },
        { id: 'english', name: 'English', book: 'Honeydew Class 8', code: '184', units: 10 }
      ]
    },
    9: {
      stage: 'secondary',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'science', name: 'Science (Physics/Chem/Bio)', book: 'Science Class 9 (NCERT)', code: '086', units: 12 },
        { id: 'math', name: 'Mathematics', book: 'Mathematics Class 9 (NCERT)', code: '041', units: 12 },
        { id: 'social', name: 'Social Science', book: 'India & Contemporary World I', code: '087', units: 18 },
        { id: 'english', name: 'English Language & Literature', book: 'Beehive Class 9', code: '184', units: 11 },
        { id: 'ai', name: 'Artificial Intelligence', book: 'CBSE Skill Subject AI', code: '417', units: 6 }
      ]
    },
    10: {
      stage: 'secondary',
      mediums: ['English', 'Hindi'],
      subjects: [
        { id: 'science', name: 'Science (Physics/Chem/Bio)', book: 'Science Class 10 (NCERT)', code: '086', units: 13 },
        { id: 'math', name: 'Mathematics (Standard/Basic)', book: 'Mathematics Class 10 (NCERT)', code: '041', units: 14 },
        { id: 'social', name: 'Social Science', book: 'Contemporary India II', code: '087', units: 20 },
        { id: 'english', name: 'English Language & Literature', book: 'First Flight Class 10', code: '184', units: 10 },
        { id: 'it', name: 'Information Technology', book: 'CBSE IT Code 402', code: '402', units: 5 }
      ]
    },
    11: {
      stage: 'senior',
      streams: ['Science', 'Commerce', 'Humanities'],
      mediums: ['English'],
      subjects: [
        { id: 'physics_11', name: 'Physics (Class 11)', book: 'Physics Parts 1 & 2 (NCERT)', code: '042', units: 10, stream: 'Science' },
        { id: 'chem_11', name: 'Chemistry (Class 11)', book: 'Chemistry Parts 1 & 2 (NCERT)', code: '043', units: 9, stream: 'Science' },
        { id: 'math_11', name: 'Mathematics (Class 11)', book: 'Mathematics (NCERT)', code: '041', units: 14, stream: 'Science' },
        { id: 'bio_11', name: 'Biology (Class 11)', book: 'Biology (NCERT)', code: '044', units: 19, stream: 'Science' },
        { id: 'cs_11', name: 'Computer Science (Python)', book: 'Computer Science Class 11', code: '083', units: 8, stream: 'Science' }
      ]
    },
    12: {
      stage: 'senior',
      streams: ['Science', 'Commerce', 'Humanities'],
      mediums: ['English'],
      subjects: [
        { id: 'physics_12', name: 'Physics (Class 12)', book: 'Physics Parts 1 & 2 (NCERT)', code: '042', units: 14, stream: 'Science' },
        { id: 'chem_12', name: 'Chemistry (Class 12)', book: 'Chemistry Parts 1 & 2 (NCERT)', code: '043', units: 10, stream: 'Science' },
        { id: 'math_12', name: 'Mathematics (Calculus/Vectors)', book: 'Mathematics Parts 1 & 2', code: '041', units: 13, stream: 'Science' },
        { id: 'bio_12', name: 'Biology (Genetics/Ecology)', book: 'Biology Class 12 (NCERT)', code: '044', units: 13, stream: 'Science' },
        { id: 'cs_12', name: 'Computer Science', book: 'Computer Science Class 12', code: '083', units: 9, stream: 'Science' }
      ]
    }
  },

  // CISCE Curriculum: Separated into Middle, ICSE (IX-X) and ISC (XI-XII)
  cisce: {
    7: {
      stage: 'middle',
      mediums: ['English'],
      subjects: [
        { id: 'physics', name: 'Physics (CISCE)', book: 'Concise Physics Class 7', code: 'PHY-07', units: 6 },
        { id: 'chemistry', name: 'Chemistry (CISCE)', book: 'Simplified Chemistry Class 7', code: 'CHE-07', units: 6 },
        { id: 'biology', name: 'Biology (CISCE)', book: 'Living Science Biology Class 7', code: 'BIO-07', units: 5 },
        { id: 'math', name: 'Mathematics', book: 'ICSE Mathematics Class 7', code: 'MAT-07', units: 16 }
      ]
    },
    10: {
      stage: 'secondary',
      examRoute: 'ICSE',
      mediums: ['English'],
      subjects: [
        { id: 'physics_icse', name: 'Physics (ICSE Class 10)', book: 'Concise Physics (Selina)', code: '52', units: 12 },
        { id: 'chemistry_icse', name: 'Chemistry (ICSE Class 10)', book: 'Concise Chemistry (Selina)', code: '53', units: 12 },
        { id: 'biology_icse', name: 'Biology (ICSE Class 10)', book: 'Concise Biology (Selina)', code: '54', units: 16 },
        { id: 'math_icse', name: 'Mathematics (ICSE Class 10)', book: 'Understanding ICSE Mathematics', code: '51', units: 22 },
        { id: 'comp_icse', name: 'Computer Applications (Java)', book: 'ICSE Computer Applications', code: '86', units: 8 }
      ]
    },
    12: {
      stage: 'senior',
      examRoute: 'ISC',
      mediums: ['English'],
      subjects: [
        { id: 'physics_isc', name: 'Physics (ISC Class 12)', book: 'Nootan ISC Physics', code: '861', units: 10 },
        { id: 'chemistry_isc', name: 'Chemistry (ISC Class 12)', book: 'Nootan ISC Chemistry', code: '862', units: 14 },
        { id: 'math_isc', name: 'Mathematics (ISC Class 12)', book: 'ISC Mathematics (ML Aggarwal)', code: '860', units: 18 }
      ]
    }
  },

  // Karnataka State Board (KSEAB)
  kseab: {
    7: {
      stage: 'middle',
      mediums: ['Kannada', 'English'],
      subjects: [
        { id: 'science_kn', name: 'Science / ವಿಜ್ಞಾನ', book: 'Karnataka DSERT Class 7 Science', code: 'K-086', units: 15 },
        { id: 'math_kn', name: 'Mathematics / ಗಣಿತ', book: 'Karnataka DSERT Class 7 Math', code: 'K-041', units: 14 },
        { id: 'social_kn', name: 'Social Science / ಸಮಾಜ ವಿಜ್ಞಾನ', book: 'Karnataka DSERT Class 7 Social', code: 'K-087', units: 20 },
        { id: 'kannada', name: 'First Language Kannada', book: 'Siri Kannada 7', code: '01K', units: 16 }
      ]
    },
    10: {
      stage: 'secondary',
      examRoute: 'SSLC',
      mediums: ['Kannada', 'English'],
      subjects: [
        { id: 'sslc_science', name: 'Science (SSLC)', book: 'Karnataka SSLC Science Part 1 & 2', code: '83E', units: 16 },
        { id: 'sslc_math', name: 'Mathematics (SSLC)', book: 'Karnataka SSLC Math Part 1 & 2', code: '81E', units: 15 },
        { id: 'sslc_social', name: 'Social Science (SSLC)', book: 'Karnataka SSLC Social Science', code: '85E', units: 30 }
      ]
    }
  }
};

/**
 * Detailed chapter taxonomy for key canonical subjects.
 */
export const DETAILED_CHAPTER_TAXONOMY = {
  // CBSE Class 7 Science (Physics / Chem / Bio / Earth)
  'cbse-7-science': [
    {
      unitId: 'u1-physical',
      unitTitle: 'Physical Phenomena & Energy',
      chapters: [
        {
          id: 'cbse-7-ch4',
          number: 4,
          title: 'Heat & Temperature Transfer',
          topics: [
            { id: 't4-1', title: 'Hot and Cold: Measuring Temperature', outcomes: ['Define temperature', 'Differentiate clinical vs laboratory thermometers'] },
            { id: 't4-2', title: 'Conduction, Convection & Radiation', outcomes: ['Explain heat transfer mechanisms', 'Identify conductors and insulators'] },
            { id: 't4-3', title: 'Sea Breeze & Land Breeze Convection Loops', outcomes: ['Relate fluid density changes to atmospheric currents'] }
          ]
        },
        {
          id: 'cbse-7-ch13',
          number: 13,
          title: 'Motion and Time',
          topics: [
            { id: 't13-1', title: 'Speed & Uniform vs Non-Uniform Motion', outcomes: ['Calculate speed = distance/time', 'Plot distance-time graphs'] },
            { id: 't13-2', title: 'Simple Pendulum Periodic Invariants', outcomes: ['Measure time period', 'Observe amplitude independence'] }
          ]
        },
        {
          id: 'cbse-7-ch14',
          number: 14,
          title: 'Electric Current and Its Effects',
          topics: [
            { id: 't14-1', title: 'Symbols of Electric Components & Circuit Schematics', outcomes: ['Construct series and parallel circuit diagrams'] },
            { id: 't14-2', title: 'Heating & Magnetic Effects (Electromagnets)', outcomes: ['Observe heating in nichrome wire', 'Construct a working electromagnet'] }
          ]
        },
        {
          id: 'cbse-7-ch15',
          number: 15,
          title: 'Light & Optics',
          topics: [
            { id: 't15-1', title: 'Rectilinear Propagation of Light', outcomes: ['Demonstrate light travels in straight lines'] },
            { id: 't15-2', title: 'Reflection & Plane Mirror Virtual Invariants', outcomes: ['Verify angle of incidence = angle of reflection'] },
            { id: 't15-3', title: 'Spherical Mirrors (Concave & Convex) & Lenses', outcomes: ['Distinguish real vs virtual images', 'Identify prism spectrum dispersion'] }
          ]
        }
      ]
    },
    {
      unitId: 'u2-chemical',
      unitTitle: 'Chemical Substances & Transformations',
      chapters: [
        {
          id: 'cbse-7-ch5',
          number: 5,
          title: 'Acids, Bases and Salts',
          topics: [
            { id: 't5-1', title: 'Natural Indicators (Turmeric, Litmus & China Rose)', outcomes: ['Detect acid/base shifts using natural color indicators'] },
            { id: 't5-2', title: 'Neutralization Reactions & Salt Formation', outcomes: ['Write word equations for acid + base neutralization'] },
            { id: 't5-3', title: 'Neutralization in Everyday Life (Antacids, Soil Treatment)', outcomes: ['Apply neutralization to real-world remediation'] }
          ]
        },
        {
          id: 'cbse-7-ch6',
          number: 6,
          title: 'Physical and Chemical Changes',
          topics: [
            { id: 't6-1', title: 'Physical Changes (Reversibility & State Changes)', outcomes: ['Distinguish physical vs chemical transformations'] },
            { id: 't6-2', title: 'Chemical Changes (Rusting & Copper Sulphate Reactions)', outcomes: ['Identify evidence of chemical reaction (gas, color, heat)'] }
          ]
        }
      ]
    },
    {
      unitId: 'u3-biological',
      unitTitle: 'Life Systems & Ecology',
      chapters: [
        {
          id: 'cbse-7-ch1',
          number: 1,
          title: 'Nutrition in Plants',
          topics: [
            { id: 't1-1', title: 'Autotrophic Photosynthesis & Chlorophyll Invariants', outcomes: ['Explain carbon dioxide + water + sunlight glucose synthesis'] },
            { id: 't1-2', title: 'Heterotrophic & Parasitic/Saprotrophic Nutrition', outcomes: ['Classify insectivorous and fungal nutrition'] }
          ]
        },
        {
          id: 'cbse-7-ch10',
          number: 10,
          title: 'Respiration in Organisms',
          topics: [
            { id: 't10-1', title: 'Aerobic vs Anaerobic Cellular Respiration', outcomes: ['Compare ATP yields and byproduct accumulation'] },
            { id: 't10-2', title: 'Human Respiratory System & Diaphragm Mechanics', outcomes: ['Demonstrate thoracic volume change and pressure differential'] }
          ]
        },
        {
          id: 'cbse-7-ch17',
          number: 17,
          title: 'Forests: Our Lifeline & Ecological Food Webs',
          topics: [
            { id: 't17-1', title: 'Trophic Pyramids & Food Web Interdependence', outcomes: ['Trace directional energy flow from autotrophs to top predators'] },
            { id: 't17-2', title: 'Decomposers & Nutrient Recycling Cycles', outcomes: ['Explain humus formation and soil fertility maintenance'] }
          ]
        }
      ]
    }
  ],

  // CBSE Class 10 Science (Secondary)
  'cbse-10-science': [
    {
      unitId: 'u1-optics',
      unitTitle: 'Natural Phenomena: Ray Optics',
      chapters: [
        {
          id: 'cbse-10-ch10',
          number: 10,
          title: 'Light — Reflection and Refraction',
          topics: [
            { id: 't10-snell', title: "Refraction & Snell's Law", outcomes: ['Calculate refractive index n = sin(i)/sin(r)', 'Trace ray displacement through slab'] },
            { id: 't10-lens', title: 'Lens Formula & Magnification', outcomes: ['Solve 1/f = 1/v - 1/u ray equations'] }
          ]
        }
      ]
    }
  ]
};

/**
 * Resolves curriculum options dynamically.
 * @param {string} authorityId
 * @param {number} classLevel
 * @param {string} [medium='English']
 * @returns {Object}
 */
export function resolveCurriculum(authorityId, classLevel, medium = 'English') {
  const auth = CURRICULUM_AUTHORITIES[authorityId?.toLowerCase()] || CURRICULUM_AUTHORITIES.cbse;
  const boardData = BOARD_CURRICULUM_DATA[authorityId?.toLowerCase()] || BOARD_CURRICULUM_DATA.cbse;
  const gradeData = boardData[classLevel] || boardData[7] || { stage: 'middle', subjects: [] };

  return {
    authority: auth,
    classLevel: Number(classLevel),
    stage: gradeData.stage || 'middle',
    examRoute: gradeData.examRoute || auth.routes[0],
    availableMediums: gradeData.mediums || auth.supportedMediums,
    subjects: gradeData.subjects || []
  };
}

/**
 * Returns chapter nodes for a given subject key.
 * @param {string} subjectKey e.g. 'cbse-7-science'
 * @returns {Array}
 */
export function getSubjectChapterTaxonomy(subjectKey) {
  return DETAILED_CHAPTER_TAXONOMY[subjectKey] || DETAILED_CHAPTER_TAXONOMY['cbse-7-science'];
}

