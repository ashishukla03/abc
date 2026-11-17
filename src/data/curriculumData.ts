export interface TopicTestQuestion {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  misconceptionAlert?: string;
}

export interface TopicActivity {
  id: string;
  title: string;
  shortDesc: string;
  durationMinutes: number;
  ncertCode: string;
  hasInquiryLab: boolean;
  labModuleId?: string; // e.g. 'sound-wave', 'fractions', 'optics', 'ph-indicator', 'solar-rover'
  status: 'mastered' | 'in_progress' | 'ready_to_learn';
  score?: number;
  testQuestions: TopicTestQuestion[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  theme: string;
  topics: TopicActivity[];
}

export interface SubjectCurriculum {
  id: string;
  name: string;
  category: 'physics' | 'chemistry' | 'biology' | 'mathematics' | 'computing' | 'social';
  colorTheme: {
    primary: string;
    border: string;
    bgTint: string;
    accent: string;
    gradient: string;
    badgeBg: string;
  };
  chapters: Chapter[];
}

export interface ClassCurriculum {
  classLevel: number;
  stage: 'Prep' | 'Middle' | 'Sec' | 'Senior';
  stageLabel: string;
  gradeBandName: string;
  standardBoard: string;
  subjects: SubjectCurriculum[];
  timetable: {
    period: number;
    time: string;
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
    subject: string;
    topic: string;
    room: string;
    teacher: string;
  }[];
  mockExams: {
    id: string;
    title: string;
    blueprint: string;
    durationMinutes: number;
    totalMarks: number;
    syllabus: string;
    urgencyDays: number;
    questionsCount: number;
  }[];
}

export const CURRICULUM_DATABASE: Record<number, ClassCurriculum> = {
  5: {
    classLevel: 5,
    stage: 'Prep',
    stageLabel: 'Preparatory (Class 5)',
    gradeBandName: 'Foundational STEM & Math Play',
    standardBoard: 'CBSE & State Board Aligned (NCERT)',
    subjects: [
      {
        id: 'math-5',
        name: 'Mathematics & Fractions Lab',
        category: 'mathematics',
        colorTheme: {
          primary: '#D97706',
          border: 'border-amber-300/80',
          bgTint: 'bg-amber-500/10',
          accent: '#F59E0B',
          gradient: 'from-amber-500/20 via-orange-400/10 to-yellow-500/10',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
        },
        chapters: [
          {
            id: 'm5-ch4',
            number: 4,
            title: 'Parts and Wholes (Equivalent Fractions)',
            theme: 'U1-NUMERACY',
            topics: [
              {
                id: 'm5-ch4-t1',
                title: "Baker's Chapati Feast: Halves, Quarters & Eighths",
                shortDesc: 'Slice and merge village celebration chapatis to visually prove 2/4 and 4/8 equals 1/2.',
                durationMinutes: 8,
                ncertCode: 'NCERT Cl 5 Math Ch 4',
                hasInquiryLab: true,
                labModuleId: 'fractions',
                status: 'mastered',
                score: 95,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'If you have 4 slices of an 8-slice chapati, how much of the whole chapati do you have?',
                    options: [
                      { id: 'a', text: '1/4 of the chapati' },
                      { id: 'b', text: '1/2 of the chapati (Equivalent Fraction)' },
                      { id: 'c', text: '4 whole chapatis' },
                      { id: 'd', text: '2/8 of the chapati' }
                    ],
                    correctOptionId: 'b',
                    explanation: '4/8 simplifies directly to 1/2 by dividing numerator and denominator by 4.',
                    misconceptionAlert: 'Larger denominator does not mean more food! Denominator represents how many pieces the whole is divided into.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'evs-5',
        name: 'Environmental Science & Nature Lab',
        category: 'biology',
        colorTheme: {
          primary: '#059669',
          border: 'border-emerald-300/80',
          bgTint: 'bg-emerald-500/10',
          accent: '#10B981',
          gradient: 'from-emerald-500/20 via-teal-400/10 to-green-500/10',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        },
        chapters: [
          {
            id: 'evs5-ch1',
            number: 1,
            title: 'Super Senses & Ecological Wonders',
            theme: 'U1-NATURE',
            topics: [
              {
                id: 'evs5-ch1-t1',
                title: 'Animal Senses & Sound Navigation',
                shortDesc: 'Observe how bats, elephants, and dogs perceive vibrations undetectable by human ears.',
                durationMinutes: 6,
                ncertCode: 'NCERT Cl 5 EVS Ch 1',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'Why do dogs react to certain whistles that humans cannot hear at all?',
                    options: [
                      { id: 'a', text: 'Because their ears are bigger' },
                      { id: 'b', text: 'Because the whistle creates ultrasound (>20,000 Hz) beyond human frequency range' },
                      { id: 'c', text: 'Because dogs imagine the sound' },
                      { id: 'd', text: 'Because the sound travels slower in air' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Canine hearing can detect high ultrasound frequencies up to 45,000 Hz, while humans top out around 20,000 Hz.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Mathematics', topic: 'Equivalent Fraction Slicing', room: 'Classroom 5A', teacher: 'Mrs. Kulkarni' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'EVS / Science', topic: 'Animal Super Senses & Sound', room: 'Nature Garden', teacher: 'Mr. Joshi' }
    ],
    mockExams: [
      { id: 'prep-term1', title: 'Class 5 Formative STEM Readiness Test', blueprint: 'NCERT Foundational Diagnostic', durationMinutes: 20, totalMarks: 20, syllabus: 'Fractions, Super Senses, Seed Dispersal', urgencyDays: 10, questionsCount: 5 }
    ]
  },

  7: {
    classLevel: 7,
    stage: 'Middle',
    stageLabel: 'Middle Stage (Classes 6–8)',
    gradeBandName: 'Integrated Experiential Science & Math',
    standardBoard: 'CBSE 2026-2027 • NCERT Syllabus',
    subjects: [
      {
        id: 'physics-7',
        name: 'Physics & Physical Science',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-600/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p7-ch4',
            number: 4,
            title: 'Heat & Temperature Transfer Dynamics',
            theme: 'U1-PHYSICAL',
            topics: [
              {
                id: 'p7-ch4-t1',
                title: 'Hot and Cold: Measuring Temperature & Thermometer Scales',
                shortDesc: 'Calibrate Celsius vs Kelvin thermometers and observe thermal equilibrium.',
                durationMinutes: 8,
                ncertCode: 'NCERT Cl 7 Science Ch 4',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'mastered',
                score: 92,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What happens to the molecules of a liquid when its temperature increases?',
                    options: [
                      { id: 'a', text: 'They stop moving completely' },
                      { id: 'b', text: 'Their average kinetic energy increases and they move faster' },
                      { id: 'c', text: 'They shrink into smaller atoms' },
                      { id: 'd', text: 'Their mass becomes heavier' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Temperature is a direct measurement of the average kinetic energy of the particles.',
                    misconceptionAlert: 'Temperature is not heat energy itself, but the intensity of the kinetic motion of particles.'
                  }
                ]
              },
              {
                id: 'p7-ch4-t2',
                title: 'Conduction, Convection & Radiation Invariants',
                shortDesc: 'Simulate heat transfer through iron rods vs wooden spoons and coastal sea breeze cycles.',
                durationMinutes: 10,
                ncertCode: 'NCERT Cl 7 Science Ch 4.2',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'in_progress',
                score: 65,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'Why are the handles of cooking pans usually made of bakelite plastic or wood?',
                    options: [
                      { id: 'a', text: 'Because wood conducts heat 10x faster' },
                      { id: 'b', text: 'Because wood is a thermal insulator with very low conductivity' },
                      { id: 'c', text: 'To make the pan look heavy' },
                      { id: 'd', text: 'Because metal cannot be shaped into handles' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Insulators do not have free electrons to rapidly transfer vibrational energy, protecting your hands from burns.'
                  }
                ]
              }
            ]
          },
          {
            id: 'p7-ch13',
            number: 13,
            title: 'Sound: Frequency, Pitch & Wave Dynamics',
            theme: 'U1-PHYSICAL',
            topics: [
              {
                id: 'p7-ch13-t1',
                title: 'Sound Detective: Wave Oscilloscope & Pitch-Frequency Decoupling',
                shortDesc: 'Synthesize audio waves from 110Hz to 880Hz. Decouple pitch from loudness on an interactive oscilloscope.',
                durationMinutes: 8,
                ncertCode: 'NCERT Cl 8 Science Ch 13',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'mastered',
                score: 95,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'If a village musician strikes a bell harder, what wave property increases without changing pitch?',
                    options: [
                      { id: 'a', text: 'Frequency (pitch becomes higher)' },
                      { id: 'b', text: 'Amplitude (loudness increases, pitch remains identical)' },
                      { id: 'c', text: 'Wave speed drops to zero' },
                      { id: 'd', text: 'Wavelength shrinks to 1 millimeter' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Striking harder imparts more energy, increasing amplitude (loudness). The physical resonance of the bell determines its frequency (pitch).',
                    misconceptionAlert: 'Many students believe striking louder makes the sound higher pitched. Frequency and Amplitude are independent properties!'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'chemistry-7',
        name: 'Chemistry & Matter Transformations',
        category: 'chemistry',
        colorTheme: {
          primary: '#7C3AED',
          border: 'border-purple-300/80',
          bgTint: 'bg-purple-500/10',
          accent: '#8B5CF6',
          gradient: 'from-purple-600/20 via-fuchsia-500/15 to-indigo-600/15',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
        },
        chapters: [
          {
            id: 'c7-ch5',
            number: 5,
            title: 'Acids, Bases and Salts (Natural Indicators)',
            theme: 'U2-CHEMICAL',
            topics: [
              {
                id: 'c7-ch5-t1',
                title: 'pH Color Lab: Turmeric, Litmus & China Rose Extraction',
                shortDesc: 'Test village soil, lemon juice, lime water, and soap solution with natural pH indicators.',
                durationMinutes: 7,
                ncertCode: 'NCERT Cl 7 Science Ch 5',
                hasInquiryLab: true,
                labModuleId: 'ph-indicator',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'When yellow turmeric paste is applied to a soap solution, what color does it turn?',
                    options: [
                      { id: 'a', text: 'Bright Blue' },
                      { id: 'b', text: 'Deep Reddish-Brown (indicating a Basic solution)' },
                      { id: 'c', text: 'Colorless' },
                      { id: 'd', text: 'Fluorescent Green' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Turmeric contains curcumin, which undergoes a chromophoric structural rearrangement in alkaline (basic) environments above pH 8.5.',
                    misconceptionAlert: 'Turmeric remains yellow in acids and neutral liquids; it only turns red in bases like soap or lime water!'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'biology-7',
        name: 'Biology & Life Systems',
        category: 'biology',
        colorTheme: {
          primary: '#059669',
          border: 'border-emerald-300/80',
          bgTint: 'bg-emerald-500/10',
          accent: '#10B981',
          gradient: 'from-emerald-600/20 via-teal-500/15 to-green-600/15',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        },
        chapters: [
          {
            id: 'b7-ch10',
            number: 10,
            title: 'Food Webs & Ecosystem Trophic Cascades',
            theme: 'U3-BIOLOGY',
            topics: [
              {
                id: 'b7-ch10-t1',
                title: 'Food Web Explorer: Trophic Cascades & Apex Predators',
                shortDesc: 'Simulate grassland ecosystems. Track grasshopper, frog, snake, and eagle populations when predators vanish.',
                durationMinutes: 6,
                ncertCode: 'NCERT Cl 7 Science Ch 10',
                hasInquiryLab: true,
                labModuleId: 'food-web',
                status: 'mastered',
                score: 88,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'If frogs are removed from a pond-grassland food chain, what happens to the insect population?',
                    options: [
                      { id: 'a', text: 'Insect population plummets to zero' },
                      { id: 'b', text: 'Insect population explodes rapidly, consuming crops' },
                      { id: 'c', text: 'Insects immediately turn into snakes' },
                      { id: 'd', text: 'Nothing changes' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Removing a secondary consumer eliminates predation pressure, leading to an overpopulation of primary consumers and crop destruction.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-7',
        name: 'Mathematics & Spatial Ratios',
        category: 'mathematics',
        colorTheme: {
          primary: '#D97706',
          border: 'border-amber-300/80',
          bgTint: 'bg-amber-500/10',
          accent: '#F59E0B',
          gradient: 'from-amber-600/20 via-orange-500/15 to-yellow-600/15',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
        },
        chapters: [
          {
            id: 'm7-ch12',
            number: 12,
            title: 'Ratio & Proportions (Village Water Share)',
            theme: 'U4-MATH',
            topics: [
              {
                id: 'm7-ch12-t1',
                title: 'Water Share Challenge: Proportional Irrigation Allocation',
                shortDesc: 'Distribute 12,000 liters of shared tank water among farms in a 3:2:1 ratio fairly.',
                durationMinutes: 6,
                ncertCode: 'NCERT Cl 6-7 Math Ch 12',
                hasInquiryLab: true,
                labModuleId: 'water-share',
                status: 'mastered',
                score: 100,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'Divide 120 liters in the ratio 3:2. How many liters does the first share receive?',
                    options: [
                      { id: 'a', text: '60 Liters' },
                      { id: 'b', text: '72 Liters (3/5 of 120)' },
                      { id: 'c', text: '80 Liters' },
                      { id: 'd', text: '48 Liters' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Total parts = 3 + 2 = 5 parts. Each part = 120 / 5 = 24 L. First share = 3 * 24 = 72 L.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Mathematics', topic: 'Ratio & Proportional Water Sharing', room: 'Room 7B', teacher: 'Mrs. Rao' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Science (Physics)', topic: 'Sound Wave Oscilloscope & Pitch', room: 'Science Lab', teacher: 'Mr. Patel' },
      { period: 3, time: '10:50 - 11:35', startHour: 10, startMin: 50, endHour: 11, endMin: 35, subject: 'Science (Chemistry)', topic: 'pH Color Lab & Indicators', room: 'Chemistry Lab', teacher: 'Dr. Sharma' },
      { period: 4, time: '11:40 - 12:25', startHour: 11, startMin: 40, endHour: 12, endMin: 25, subject: 'Social Science', topic: 'Indus Valley Urban Drainage', room: 'Room 7B', teacher: 'Mr. Kumar' },
      { period: 5, time: '01:15 - 02:00', startHour: 13, startMin: 15, endHour: 14, endMin: 0, subject: 'Computing', topic: 'Solar Rover Algorithm Sequence', room: 'ICT Room', teacher: 'Ms. Anitha' },
      { period: 6, time: '02:05 - 02:50', startHour: 14, startMin: 5, endHour: 14, endMin: 50, subject: 'Language', topic: 'Basavanna Vachana Decipherer', room: 'Room 7B', teacher: 'Mr. Gowda' }
    ],
    mockExams: [
      { id: 'exam-sci-t1', title: 'Class 7 Science Term 1 Summative Mock', blueprint: 'CBSE Calibrated Blueprint', durationMinutes: 30, totalMarks: 25, syllabus: 'Sound, Acids & Bases, Heat Transfer, Ecosystems', urgencyDays: 14, questionsCount: 5 },
      { id: 'exam-mth-mid', title: 'CBSE Mathematics Mid-Term Evaluation', blueprint: 'NCERT Competency Framework', durationMinutes: 45, totalMarks: 40, syllabus: 'Ratio & Proportion, Fractions, Linear Equations', urgencyDays: 21, questionsCount: 8 }
    ]
  },

  10: {
    classLevel: 10,
    stage: 'Sec',
    stageLabel: 'Secondary Stage (Classes 9–10)',
    gradeBandName: 'Board Exam Mastery & Rigorous Inquiry',
    standardBoard: 'CBSE / ICSE Board Examination Matrix',
    subjects: [
      {
        id: 'physics-10',
        name: 'Ray Optics & Electromagnetism',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-600/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p10-ch10',
            number: 10,
            title: "Light: Reflection, Refraction & Snell's Law",
            theme: 'U1-OPTICS',
            topics: [
              {
                id: 'p10-ch10-t1',
                title: "Ray Optics: Snell's Law & Total Internal Reflection (TIR)",
                shortDesc: 'Drag incident laser angles through glass and water slabs to calculate refractive index and critical angle.',
                durationMinutes: 12,
                ncertCode: 'NCERT Cl 10 Science Ch 10',
                hasInquiryLab: true,
                labModuleId: 'optics',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What happens when light travels from glass (dense) into air (rare) at an incident angle greater than the critical angle?',
                    options: [
                      { id: 'a', text: 'It refracts straight through at 90 degrees' },
                      { id: 'b', text: 'Total Internal Reflection occurs (100% reflected back into glass)' },
                      { id: 'c', text: 'The light beam is absorbed into darkness' },
                      { id: 'd', text: 'The light changes color to blue' }
                    ],
                    correctOptionId: 'b',
                    explanation: "When angle i > critical angle, no refraction into medium 2 is mathematically possible under Snell's Law; the boundary acts as an ideal mirror.",
                    misconceptionAlert: 'TIR only occurs when transitioning from a denser medium to an optically rarer medium, never from air into glass!'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Physics', topic: "Light Refraction & Snell's Law", room: 'Physics Lab', teacher: 'Dr. Deshmukh' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Mathematics', topic: 'Quadratic Equations & Roots', room: 'Room 10A', teacher: 'Mrs. Sen' }
    ],
    mockExams: [
      { id: 'exam-cbse10-board', title: 'Class 10 CBSE Board Simulator (Science)', blueprint: 'Official CBSE Blueprint (2026)', durationMinutes: 60, totalMarks: 50, syllabus: 'Ray Optics, Chemical Reactions, Electricity, Life Processes', urgencyDays: 30, questionsCount: 12 }
    ]
  },

  12: {
    classLevel: 12,
    stage: 'Senior',
    stageLabel: 'Senior Secondary Stage (Classes 11–12)',
    gradeBandName: 'Advanced STEM & Competitive Olympiad (JEE/NEET)',
    standardBoard: 'CBSE Senior Secondary / JEE Foundation',
    subjects: [
      {
        id: 'math-12',
        name: 'Calculus & Applications of Integrals',
        category: 'mathematics',
        colorTheme: {
          primary: '#D97706',
          border: 'border-amber-300/80',
          bgTint: 'bg-amber-500/10',
          accent: '#F59E0B',
          gradient: 'from-amber-600/20 via-orange-500/15 to-yellow-600/15',
          badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
        },
        chapters: [
          {
            id: 'm12-ch8',
            number: 8,
            title: 'Definite Integrals & Riemann Sum Plotter',
            theme: 'U1-CALCULUS',
            topics: [
              {
                id: 'm12-ch8-t1',
                title: 'Solar Roof Calculus: Convergence of Riemann Sum Slices',
                shortDesc: 'Increase rectangular slice count from N=4 to N=100 to visualize numerical area convergence to the definite integral.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 12 Math Ch 8',
                hasInquiryLab: true,
                labModuleId: 'calculus',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'As the width of Riemann slices Δx approaches zero (N → ∞), what does the sum of slice areas equal?',
                    options: [
                      { id: 'a', text: 'Infinity' },
                      { id: 'b', text: 'The exact definite integral ∫ f(x)dx' },
                      { id: 'c', text: 'Zero' },
                      { id: 'd', text: 'f(b) - f(a) multiplied by 2' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'By the fundamental definition of the Riemann integral, the limit of the Riemann sum as mesh width vanishes converges to the exact signed area.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Mathematics', topic: 'Definite Integrals & Riemann Limits', room: 'Senior Hall 1', teacher: 'Prof. Roy' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Physics', topic: 'Electromagnetic Induction & Faraday Law', room: 'Physics Lab 2', teacher: 'Dr. Nair' }
    ],
    mockExams: [
      { id: 'exam-jee-adv', title: 'JEE Main & CBSE Class 12 Advanced Simulator', blueprint: 'NTA Standard Scoring', durationMinutes: 60, totalMarks: 100, syllabus: 'Calculus, Electrodynamics, Organic Transformations', urgencyDays: 45, questionsCount: 15 }
    ]
  }
};
