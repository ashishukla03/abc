// Comprehensive NCERT-aligned curriculum database for Classes 5 through 12
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
  labModuleId?: 'sound-wave' | 'fractions' | 'optics' | 'ph-indicator' | 'calculus' | 'electric-circuit' | 'cell-explorer' | 'motion-graph';
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
            title: 'Parts and Wholes (Fractions)',
            theme: 'U1-NUMERACY',
            topics: [
              {
                id: 'm5-ch4-t1',
                title: 'The Chapati & Pizza Equal Share Cutter',
                shortDesc: 'Slice a circular roti into 2, 4, and 8 equal portions. Discover why 2/4 and 4/8 simplify to 1/2.',
                durationMinutes: 12,
                ncertCode: 'NCERT Cl 5 Math Ch 4',
                hasInquiryLab: true,
                labModuleId: 'fractions',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'If a roti is sliced into 4 equal pieces and Ramu eats 2 slices, what fraction did he eat?',
                    options: [
                      { id: 'a', text: '1/4' },
                      { id: 'b', text: '1/2' },
                      { id: 'c', text: '3/4' },
                      { id: 'd', text: '4/2' }
                    ],
                    correctOptionId: 'b',
                    explanation: '2 out of 4 slices is 2/4. Both 2 and 4 divide by 2, simplifying to 1/2.',
                    misconceptionAlert: 'Remember: 2/4 is not 2 wholes! It represents half of the whole.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'evs-5',
        name: 'Environmental Science (EVS)',
        category: 'biology',
        colorTheme: {
          primary: '#059669',
          border: 'border-emerald-300/80',
          bgTint: 'bg-emerald-500/10',
          accent: '#10B981',
          gradient: 'from-emerald-500/20 via-teal-500/10 to-green-500/10',
          badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
        },
        chapters: [
          {
            id: 'evs5-ch1',
            number: 1,
            title: 'Super Senses of Living Beings',
            theme: 'U1-BIOLOGY',
            topics: [
              {
                id: 'evs5-ch1-t1',
                title: 'Ant Trails & Bat Sound Navigation',
                shortDesc: 'Explore how ants leave chemical scent trails and how bats use echolocation sound waves to navigate in pitch dark.',
                durationMinutes: 10,
                ncertCode: 'NCERT Cl 5 EVS Ch 1',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'How do bats catch prey in absolute darkness without using sight?',
                    options: [
                      { id: 'a', text: 'High frequency ultrasonic echo reflections' },
                      { id: 'b', text: 'Infrared heat vision' },
                      { id: 'c', text: 'Smelling insects from afar' },
                      { id: 'd', text: 'Magnetic field sensing' }
                    ],
                    correctOptionId: 'a',
                    explanation: 'Bats emit high pitch ultrasonic clicks and interpret returning sound echoes (echolocation).'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Math Fractions', topic: 'Parts and Wholes Visual Cutter', room: 'Junior Room 1', teacher: 'Mrs. Sharma' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'EVS Discovery', topic: 'Super Senses of Animals', room: 'Activity Hall', teacher: 'Mr. Verma' }
    ],
    mockExams: [
      { id: 'exam-cl5-mid', title: 'Class 5 Formative Assessment (Math & EVS)', blueprint: 'Foundational Stage Standard', durationMinutes: 30, totalMarks: 25, syllabus: 'Fractions, Super Senses, Shapes', urgencyDays: 14, questionsCount: 8 }
    ]
  },

  6: {
    classLevel: 6,
    stage: 'Middle',
    stageLabel: 'Middle Stage (Class 6)',
    gradeBandName: 'Introductory Inquiry & Scientific Observation',
    standardBoard: 'CBSE & State Board Aligned (NCERT)',
    subjects: [
      {
        id: 'sci-6',
        name: 'General Science: Light & Shadows',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-500/20 via-cyan-500/10 to-indigo-500/10',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 's6-ch11',
            number: 11,
            title: 'Light, Shadows and Reflections',
            theme: 'U2-OPTICS',
            topics: [
              {
                id: 's6-ch11-t1',
                title: 'Pinhole Camera & Ray Reflection',
                shortDesc: 'Observe how light travels in straight lines and reflects off shiny mirror surfaces.',
                durationMinutes: 12,
                ncertCode: 'NCERT Cl 6 Sci Ch 11',
                hasInquiryLab: true,
                labModuleId: 'optics',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What type of image is formed by a pinhole camera?',
                    options: [
                      { id: 'a', text: 'Erect and virtual' },
                      { id: 'b', text: 'Inverted and real' },
                      { id: 'c', text: 'Magnified and upright' },
                      { id: 'd', text: 'No image is formed' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Because light travels strictly in straight lines, rays crossing through the tiny aperture form an inverted real image.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-6',
        name: 'Mathematics: Ratios & Integers',
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
            id: 'm6-ch6',
            number: 6,
            title: 'Integers and Number Lines',
            theme: 'U1-NUMERACY',
            topics: [
              {
                id: 'm6-ch6-t1',
                title: 'Fraction and Ratio Proportions',
                shortDesc: 'Understand parts of a whole and how scaling numerator and denominator preserves value.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 6 Math Ch 6',
                hasInquiryLab: true,
                labModuleId: 'fractions',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'Which fraction is equivalent to 3/6?',
                    options: [
                      { id: 'a', text: '1/3' },
                      { id: 'b', text: '1/2' },
                      { id: 'c', text: '2/3' },
                      { id: 'd', text: '3/4' }
                    ],
                    correctOptionId: 'b',
                    explanation: '3/6 reduces to 1/2 by dividing both top and bottom by 3.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Science', topic: 'Light & Shadows Exploration', room: 'Middle Lab A', teacher: 'Mr. Joshi' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Mathematics', topic: 'Ratios & Fraction Equivalents', room: 'Room 6B', teacher: 'Mrs. Patel' }
    ],
    mockExams: [
      { id: 'exam-cl6-term1', title: 'Class 6 Term 1 Diagnostic Test', blueprint: 'NCERT Middle School Standard', durationMinutes: 45, totalMarks: 35, syllabus: 'Light & Shadows, Fractions, Food Components', urgencyDays: 20, questionsCount: 10 }
    ]
  },

  7: {
    classLevel: 7,
    stage: 'Middle',
    stageLabel: 'Middle Stage (Class 7)',
    gradeBandName: 'Conceptual STEM & Physical Inquiry',
    standardBoard: 'CBSE & State Board Aligned (NCERT)',
    subjects: [
      {
        id: 'physics-7',
        name: 'Physics: Sound & Motion Lab',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p7-ch13',
            number: 13,
            title: 'Sound Waves & Oscillations',
            theme: 'U1-PHYSICAL',
            topics: [
              {
                id: 'p7-ch13-t1',
                title: 'Sound Detective: Pitch vs Frequency Oscilloscope',
                shortDesc: 'Vary frequency (110–880 Hz) and amplitude to observe sound wave changes and synthesize live audio tones.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 7/8 Science Ch 13',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'in_progress',
                score: 85,
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'If you strike a bell harder, which wave characteristic increases primarily?',
                    options: [
                      { id: 'a', text: 'Wave Frequency (Pitch gets higher)' },
                      { id: 'b', text: 'Wave Amplitude (Loudness increases)' },
                      { id: 'c', text: 'Wave Speed in Air' },
                      { id: 'd', text: 'Wave Period' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Striking harder imparts more energy, which expands the vibrational amplitude (loudness). The intrinsic natural pitch (frequency) remains fixed.',
                    misconceptionAlert: 'Striking harder increases amplitude (loudness), NOT frequency (pitch)!'
                  },
                  {
                    id: 'q2',
                    prompt: 'What is the audible frequency range for human ears?',
                    options: [
                      { id: 'a', text: '2 Hz to 200 Hz' },
                      { id: 'b', text: '20 Hz to 20,000 Hz' },
                      { id: 'c', text: '200 Hz to 200,000 Hz' },
                      { id: 'd', text: '0 Hz to 100 Hz' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'The healthy human ear responds to acoustic vibrations between 20 Hz (deep bass) and 20,000 Hz (high treble).'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-7',
        name: 'Chemistry: Acids, Bases & Indicators',
        category: 'chemistry',
        colorTheme: {
          primary: '#7C3AED',
          border: 'border-purple-300/80',
          bgTint: 'bg-purple-500/10',
          accent: '#8B5CF6',
          gradient: 'from-purple-600/20 via-fuchsia-500/15 to-indigo-500/15',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
        },
        chapters: [
          {
            id: 'c7-ch5',
            number: 5,
            title: 'Acids, Bases and Salts',
            theme: 'U2-CHEMICAL',
            topics: [
              {
                id: 'c7-ch5-t1',
                title: 'Natural Turmeric & Litmus Test Tube Reaction',
                shortDesc: 'Mix lemon juice, vinegar, distilled water, and soap into natural turmeric and litmus indicators.',
                durationMinutes: 14,
                ncertCode: 'NCERT Cl 7 Science Ch 5',
                hasInquiryLab: true,
                labModuleId: 'ph-indicator',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What happens when yellow turmeric paste is exposed to a basic solution like soap?',
                    options: [
                      { id: 'a', text: 'It stays bright yellow' },
                      { id: 'b', text: 'It turns deep reddish-brown' },
                      { id: 'c', text: 'It turns transparent' },
                      { id: 'd', text: 'It turns dark blue' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Curcumin in turmeric changes from yellow to deep reddish-brown in alkaline/basic conditions (pH > 7.4).',
                    misconceptionAlert: 'Turmeric turns red with BASES (like soap or lime water), but stays yellow with ACIDS (like lemon)!'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Physics', topic: 'Sound Waves & Oscilloscope', room: 'Lab 1', teacher: 'Dr. Deshmukh' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Chemistry', topic: 'Acids, Bases and Turmeric Indicator', room: 'Lab 2', teacher: 'Dr. Sen' }
    ],
    mockExams: [
      { id: 'exam-cl7-mid', title: 'Class 7 Mid-Term STEM Challenge', blueprint: 'State & CBSE Composite', durationMinutes: 45, totalMarks: 40, syllabus: 'Sound, Heat, Acids & Bases, Fractions', urgencyDays: 18, questionsCount: 10 }
    ]
  },

  8: {
    classLevel: 8,
    stage: 'Middle',
    stageLabel: 'Middle Stage (Class 8)',
    gradeBandName: 'Applied Science & Chemical Transformations',
    standardBoard: 'CBSE & State Board Aligned (NCERT)',
    subjects: [
      {
        id: 'chem-8',
        name: 'Chemistry: Materials & Combustion',
        category: 'chemistry',
        colorTheme: {
          primary: '#7C3AED',
          border: 'border-purple-300/80',
          bgTint: 'bg-purple-500/10',
          accent: '#8B5CF6',
          gradient: 'from-purple-600/20 via-fuchsia-500/15 to-indigo-500/15',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
        },
        chapters: [
          {
            id: 'c8-ch4',
            number: 4,
            title: 'Metals, Non-metals and Acid Reactions',
            theme: 'U1-CHEMICAL',
            topics: [
              {
                id: 'c8-ch4-t1',
                title: 'pH Indicators and Neutralization Reactions',
                shortDesc: 'Observe how acid-base neutralization shifts pH and indicator color to neutral green.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 8 Sci Ch 4',
                hasInquiryLab: true,
                labModuleId: 'ph-indicator',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What gas is produced when metals react with dilute acids?',
                    options: [
                      { id: 'a', text: 'Oxygen' },
                      { id: 'b', text: 'Hydrogen (burns with a pop sound)' },
                      { id: 'c', text: 'Carbon Dioxide' },
                      { id: 'd', text: 'Nitrogen' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Active metals displace hydrogen ions from dilute acids, releasing H2 gas.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'phy-8',
        name: 'Physics: Sound & Friction',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p8-ch13',
            number: 13,
            title: 'Sound Production & Tuning Forks',
            theme: 'U2-PHYSICAL',
            topics: [
              {
                id: 'p8-ch13-t1',
                title: 'Frequency and Pitch Tuning Experiment',
                shortDesc: 'Synthesize audio waves and watch wavelength contract as pitch doubles.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 8 Sci Ch 13',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What happens to the pitch of sound when the frequency of vibration increases?',
                    options: [
                      { id: 'a', text: 'Pitch becomes lower (deeper)' },
                      { id: 'b', text: 'Pitch becomes higher (shriller)' },
                      { id: 'c', text: 'Loudness drops to zero' },
                      { id: 'd', text: 'No change in pitch' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Higher frequency corresponds directly to a higher auditory pitch.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Chemistry', topic: 'Neutralization & pH Indicators', room: 'Chem Lab 1', teacher: 'Dr. Sen' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Physics', topic: 'Sound Vibrations & Pitch', room: 'Physics Room', teacher: 'Dr. Deshmukh' }
    ],
    mockExams: [
      { id: 'exam-cl8-mid', title: 'Class 8 National Science Talent Search Simulator', blueprint: 'NSTSE Standard Blueprint', durationMinutes: 50, totalMarks: 50, syllabus: 'Sound, Combustion, Microorganisms, Algebraic Expressions', urgencyDays: 25, questionsCount: 12 }
    ]
  },

  9: {
    classLevel: 9,
    stage: 'Sec',
    stageLabel: 'Secondary Stage (Class 9)',
    gradeBandName: 'Secondary Foundations & Rigorous STEM',
    standardBoard: 'CBSE & State Board Aligned (NCERT)',
    subjects: [
      {
        id: 'phy-9',
        name: 'Physics: Motion & Force',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p9-ch8',
            number: 8,
            title: 'Motion & Velocity-Time Relations',
            theme: 'U1-PHYSICS',
            topics: [
              {
                id: 'p9-ch8-t1',
                title: 'Acoustics, Sound Echoes & Doppler Effect',
                shortDesc: 'Analyze wave frequency, speed of sound in air (343 m/s), and reflected echoes.',
                durationMinutes: 16,
                ncertCode: 'NCERT Cl 9 Sci Ch 8/12',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What minimum distance between observer and obstacle is required to hear a distinct echo in air (at 20°C)?',
                    options: [
                      { id: 'a', text: '5.5 meters' },
                      { id: 'b', text: '11.2 meters' },
                      { id: 'c', text: '17.2 meters' },
                      { id: 'd', text: '34.4 meters' }
                    ],
                    correctOptionId: 'c',
                    explanation: 'Human persistence of hearing is 0.1s. Total path = 344 m/s * 0.1s = 34.4 m. One-way distance = 34.4 / 2 = 17.2 meters.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-9',
        name: 'Chemistry: Atoms & Molecules',
        category: 'chemistry',
        colorTheme: {
          primary: '#7C3AED',
          border: 'border-purple-300/80',
          bgTint: 'bg-purple-500/10',
          accent: '#8B5CF6',
          gradient: 'from-purple-600/20 via-fuchsia-500/15 to-indigo-500/15',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
        },
        chapters: [
          {
            id: 'c9-ch2',
            number: 2,
            title: 'Is Matter Around Us Pure (Solutions & Colloids)',
            theme: 'U2-CHEMISTRY',
            topics: [
              {
                id: 'c9-ch2-t1',
                title: 'pH Scale and Solution Acid-Base Chemistry',
                shortDesc: 'Measure ionization and color reactions of common household solutes.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 9 Sci Ch 2',
                hasInquiryLab: true,
                labModuleId: 'ph-indicator',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What is the Tyndall effect observed in colloidal mixtures?',
                    options: [
                      { id: 'a', text: 'Scattering of light beams by dispersed particles' },
                      { id: 'b', text: 'Formation of gas bubbles' },
                      { id: 'c', text: 'Sudden decrease in temperature' },
                      { id: 'd', text: 'Change of color when stirred' }
                    ],
                    correctOptionId: 'a',
                    explanation: 'Colloid particles are large enough to scatter incident light, making the beam path visible.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Physics', topic: 'Echoes & Wave Velocity', room: 'Room 9A', teacher: 'Dr. Deshmukh' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Chemistry', topic: 'Colloids & pH Scale', room: 'Chemistry Lab', teacher: 'Dr. Sen' }
    ],
    mockExams: [
      { id: 'exam-cl9-term', title: 'Class 9 CBSE Science Mock Assessment', blueprint: 'CBSE Secondary Blueprint', durationMinutes: 60, totalMarks: 50, syllabus: 'Motion, Gravitation, Matter, Tissues', urgencyDays: 28, questionsCount: 12 }
    ]
  },

  10: {
    classLevel: 10,
    stage: 'Sec',
    stageLabel: 'Secondary Stage (Class 10)',
    gradeBandName: 'CBSE Board Examination & STEM Core',
    standardBoard: 'CBSE All-India Secondary Examination',
    subjects: [
      {
        id: 'physics-10',
        name: 'Physics: Light & Ray Optics',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p10-ch10',
            number: 10,
            title: 'Light: Reflection, Refraction and Snell’s Law',
            theme: 'U1-PHYSICS',
            topics: [
              {
                id: 'p10-ch10-t1',
                title: 'Snell’s Law & Total Internal Reflection Ray Tracer',
                shortDesc: 'Dial incidence angle from 0° to 90° across air-to-glass (n=1.52) interface. Calculate refracted angle r and watch critical angle Total Internal Reflection.',
                durationMinutes: 18,
                ncertCode: 'NCERT Cl 10 Science Ch 10',
                hasInquiryLab: true,
                labModuleId: 'optics',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What happens when light travels from glass (dense, n=1.5) into air (rare, n=1.0) at an incident angle greater than the critical angle (41.8°)?',
                    options: [
                      { id: 'a', text: 'It refracts straight through along the normal' },
                      { id: 'b', text: 'Total Internal Reflection occurs (100% reflected back into glass)' },
                      { id: 'c', text: 'The light beam is completely absorbed' },
                      { id: 'd', text: 'The light wavelength increases tenfold' }
                    ],
                    correctOptionId: 'b',
                    explanation: "When angle i > critical angle, no refraction into air is possible under Snell's Law; the boundary acts as a 100% efficient mirror.",
                    misconceptionAlert: 'TIR only occurs when transitioning from a denser medium to an optically rarer medium, never from air into glass!'
                  },
                  {
                    id: 'q2',
                    prompt: 'According to Snell’s Law, what is the constant ratio for two media?',
                    options: [
                      { id: 'a', text: 'sin(i) / sin(r)' },
                      { id: 'b', text: 'tan(i) / tan(r)' },
                      { id: 'c', text: 'i / r' },
                      { id: 'd', text: 'cos(i) * cos(r)' }
                    ],
                    correctOptionId: 'a',
                    explanation: 'Snell’s law states that sin(i) / sin(r) = n2 / n1 (refractive index of second medium relative to the first).'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'chem-10',
        name: 'Chemistry: Reactions & Equations',
        category: 'chemistry',
        colorTheme: {
          primary: '#7C3AED',
          border: 'border-purple-300/80',
          bgTint: 'bg-purple-500/10',
          accent: '#8B5CF6',
          gradient: 'from-purple-600/20 via-fuchsia-500/15 to-indigo-500/15',
          badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
        },
        chapters: [
          {
            id: 'c10-ch2',
            number: 2,
            title: 'Acids, Bases and Salts (pH in Daily Life)',
            theme: 'U2-CHEMISTRY',
            topics: [
              {
                id: 'c10-ch2-t1',
                title: 'pH Scale & Universal Indicator Color Chart',
                shortDesc: 'Explore how hydrogen ion concentration determines acidity and test indicators from pH 0 to 14.',
                durationMinutes: 15,
                ncertCode: 'NCERT Cl 10 Science Ch 2',
                hasInquiryLab: true,
                labModuleId: 'ph-indicator',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What is the pH of human blood in a healthy body?',
                    options: [
                      { id: 'a', text: '1.2 - 2.0 (strongly acidic)' },
                      { id: 'b', text: '7.35 - 7.45 (slightly alkaline)' },
                      { id: 'c', text: '9.5 - 10.5 (strongly basic)' },
                      { id: 'd', text: '5.0 - 5.5 (mildly acidic)' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'Human physiological blood is maintained tightly between pH 7.35 and 7.45 by carbonic acid-bicarbonate buffers.'
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
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Chemistry', topic: 'Acids, Bases & Universal pH Scale', room: 'Chemistry Lab', teacher: 'Mrs. Sen' }
    ],
    mockExams: [
      { id: 'exam-cbse10-board', title: 'Class 10 CBSE Board Simulator (Science)', blueprint: 'Official CBSE Blueprint (2026)', durationMinutes: 60, totalMarks: 50, syllabus: 'Ray Optics, Chemical Reactions, Electricity, Life Processes', urgencyDays: 30, questionsCount: 12 }
    ]
  },

  11: {
    classLevel: 11,
    stage: 'Senior',
    stageLabel: 'Senior Secondary (Class 11)',
    gradeBandName: 'Senior Secondary STEM & JEE/NEET Foundations',
    standardBoard: 'CBSE Senior Secondary / NTA Aligned',
    subjects: [
      {
        id: 'phy-11',
        name: 'Physics: Waves & Oscillations',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p11-ch15',
            number: 15,
            title: 'Simple Harmonic Motion and Standing Waves',
            theme: 'U1-WAVES',
            topics: [
              {
                id: 'p11-ch15-t1',
                title: 'Harmonics and Superposition Principle',
                shortDesc: 'Superimpose waves to form standing nodes and antinodes. Adjust frequency to observe harmonic overtones.',
                durationMinutes: 18,
                ncertCode: 'NCERT Cl 11 Phy Ch 15',
                hasInquiryLab: true,
                labModuleId: 'sound-wave',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'At a node in a standing wave, what is the net vibrational displacement?',
                    options: [
                      { id: 'a', text: 'Maximum possible amplitude' },
                      { id: 'b', text: 'Permanently zero' },
                      { id: 'c', text: 'Oscillates between positive and negative maximum' },
                      { id: 'd', text: 'Equal to half the wavelength' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'A node is a location of destructive interference where the standing wave amplitude is always zero.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'math-11',
        name: 'Mathematics: Limits and Derivatives',
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
            id: 'm11-ch13',
            number: 13,
            title: 'Limits & Intro to Calculus',
            theme: 'U2-CALCULUS',
            topics: [
              {
                id: 'm11-ch13-t1',
                title: 'Riemann Rectangle Sum Area Approximator',
                shortDesc: 'Divide the area under a quadratic curve into increasing rectangular partitions to converge to the exact limit.',
                durationMinutes: 16,
                ncertCode: 'NCERT Cl 11 Math Ch 13',
                hasInquiryLab: true,
                labModuleId: 'calculus',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'What represents the slope of the tangent line to a curve f(x) at point x?',
                    options: [
                      { id: 'a', text: 'The definite integral ∫ f(x)dx' },
                      { id: 'b', text: 'The first derivative f\'(x) = lim(h→0) [f(x+h) - f(x)] / h' },
                      { id: 'c', text: 'f(x) / x' },
                      { id: 'd', text: 'The second derivative f\'\'(x)' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'The derivative represents the instantaneous rate of change and geometric tangent slope.'
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    timetable: [
      { period: 1, time: '09:00 - 09:45', startHour: 9, startMin: 0, endHour: 9, endMin: 45, subject: 'Physics', topic: 'Standing Waves & SHM Harmonics', room: 'Senior Lab 1', teacher: 'Dr. Nair' },
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Mathematics', topic: 'Limits & Riemann Sum Partitions', room: 'Senior Hall 2', teacher: 'Prof. Roy' }
    ],
    mockExams: [
      { id: 'exam-jee11-adv', title: 'Class 11 JEE & NEET Foundation Test', blueprint: 'NTA Standard Scoring', durationMinutes: 60, totalMarks: 60, syllabus: 'SHM, Waves, Limits, Chemical Bonding', urgencyDays: 35, questionsCount: 15 }
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
                shortDesc: 'Increase rectangular slice count from N=4 to N=100 to visualize numerical area convergence to the definite integral ∫ x² dx.',
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
                  },
                  {
                    id: 'q2',
                    prompt: 'What is the value of ∫ from 0 to 2 of x dx?',
                    options: [
                      { id: 'a', text: '1' },
                      { id: 'b', text: '2' },
                      { id: 'c', text: '4' },
                      { id: 'd', text: '0.5' }
                    ],
                    correctOptionId: 'b',
                    explanation: '∫ x dx = x²/2. Evaluated from 0 to 2: (2²/2) - (0²/2) = 4/2 = 2.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'phy-12',
        name: 'Physics: Ray & Wave Optics',
        category: 'physics',
        colorTheme: {
          primary: '#2563EB',
          border: 'border-blue-300/80',
          bgTint: 'bg-blue-500/10',
          accent: '#3B82F6',
          gradient: 'from-blue-600/20 via-cyan-500/15 to-indigo-500/15',
          badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
        },
        chapters: [
          {
            id: 'p12-ch9',
            number: 9,
            title: 'Ray Optics and Optical Instruments',
            theme: 'U2-OPTICS',
            topics: [
              {
                id: 'p12-ch9-t1',
                title: 'Fiber Optics & Critical Angle Snell Tracer',
                shortDesc: 'Analyze laser beam propagation through optical fibers using Total Internal Reflection at varying core-cladding boundary angles.',
                durationMinutes: 18,
                ncertCode: 'NCERT Cl 12 Phy Ch 9',
                hasInquiryLab: true,
                labModuleId: 'optics',
                status: 'ready_to_learn',
                testQuestions: [
                  {
                    id: 'q1',
                    prompt: 'In optical fiber data cables, why must the core have a higher refractive index than the surrounding cladding?',
                    options: [
                      { id: 'a', text: 'To allow light to escape easily' },
                      { id: 'b', text: 'To satisfy conditions for Total Internal Reflection (TIR) inside the core' },
                      { id: 'c', text: 'To filter out ultraviolet wavelengths' },
                      { id: 'd', text: 'To prevent overheating' }
                    ],
                    correctOptionId: 'b',
                    explanation: 'TIR can only occur when light attempts to travel from a higher index medium (core) to a lower index medium (cladding) at angles above critical angle.'
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
      { period: 2, time: '09:50 - 10:35', startHour: 9, startMin: 50, endHour: 10, endMin: 35, subject: 'Physics', topic: 'Fiber Optics & Total Internal Reflection', room: 'Physics Lab 2', teacher: 'Dr. Nair' }
    ],
    mockExams: [
      { id: 'exam-jee-adv', title: 'JEE Main & CBSE Class 12 Advanced Simulator', blueprint: 'NTA Standard Scoring', durationMinutes: 60, totalMarks: 100, syllabus: 'Calculus, Electrodynamics, Organic Transformations', urgencyDays: 45, questionsCount: 15 }
    ]
  }
};

export interface UserProfile {
  name: string;
  school: string;
  classId: number;
  xp: number;
  competencies: {
    Mathematics: number;
    Physics: number;
    Chemistry: number;
    Biology: number;
    Computing: number;
    [key: string]: number;
  };
  streakDays?: number;
  avatar?: string;
  board?: string;
}

export const userProfile: UserProfile = {
  name: 'Aarav Sharma',
  school: 'PM SHRI Kendriya Vidyalaya',
  classId: 10,
  xp: 1450,
  competencies: {
    Mathematics: 88,
    Physics: 92,
    Chemistry: 78,
    Biology: 85,
    Computing: 95
  },
  streakDays: 14,
  avatar: '👨‍🎓',
  board: 'CBSE (NCERT Aligned)'
};

export const ncertCurriculum: Record<number | string, any> = Object.fromEntries(
  Object.entries(CURRICULUM_DATABASE).map(([classLevel, data]) => {
    const subjects = data.subjects.map(s => ({
      ...s,
      colorTint: s.colorTheme?.bgTint || 'bg-blue-500/10',
      units: [
        {
          id: `unit-${s.id}-1`,
          title: `${s.name} — Unit 1: Theory, Models & Inquiry Labs`,
          chapters: s.chapters.map(ch => ({
            ...ch,
            topics: ch.topics.map(t => ({
              ...t,
              status: (t.status === 'mastered' ? 'mastered' : t.status === 'ready_to_learn' || t.status === 'in_progress' ? 'ready' : 'locked') as 'mastered' | 'ready' | 'locked'
            }))
          }))
        }
      ],
      chapters: s.chapters.map(ch => ({
        ...ch,
        topics: ch.topics.map(t => ({
          ...t,
          status: (t.status === 'mastered' ? 'mastered' : t.status === 'ready_to_learn' || t.status === 'in_progress' ? 'ready' : 'locked') as 'mastered' | 'ready' | 'locked'
        }))
      }))
    }));

    const arrayWithMetadata = Object.assign([...subjects], {
      ...data,
      subjects
    });

    return [Number(classLevel), arrayWithMetadata];
  })
);

