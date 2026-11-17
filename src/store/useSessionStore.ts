import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CURRICULUM_DATABASE, ClassCurriculum, TopicActivity } from '../data/curriculumData';

export interface UserProfile {
  id: string;
  name: string;
  school: string;
  board: string;
  avatar: string;
  level: number;
  xp: number;
  streakDays: number;
  completedLabsCount: number;
  badges: { id: string; title: string; icon: string; earnedAt: string }[];
}

export interface CompetencyScores {
  physics: number;
  math: number;
  chemistry: number;
  biology: number;
  social: number;
  computing: number;
}

export interface SessionState {
  selectedClass: number;
  curriculumStage: 'Prep' | 'Middle' | 'Sec' | 'Senior';
  userProfile: UserProfile;
  competencyScores: CompetencyScores;
  topicProgress: Record<string, { status: 'mastered' | 'in_progress' | 'ready_to_learn'; score?: number }>;
  
  // Actions
  setSelectedClass: (classLevel: number) => void;
  setCurriculumStage: (stage: 'Prep' | 'Middle' | 'Sec' | 'Senior') => void;
  addXP: (amount: number) => void;
  updateCompetencyScore: (subject: keyof CompetencyScores, delta: number) => void;
  completeTopicTest: (topicId: string, score: number, subjectCategory: keyof CompetencyScores) => void;
  completeLab: (topicId: string, subjectCategory: keyof CompetencyScores) => void;
  getCurrentCurriculum: () => ClassCurriculum;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'aarav-sharma',
  name: 'Aarav Sharma',
  school: 'Zilla Parishad High School, Ballari',
  board: 'CBSE',
  avatar: '👨‍🎓',
  level: 3,
  xp: 450,
  streakDays: 7,
  completedLabsCount: 3,
  badges: [
    { id: 'b-wave', title: 'Sonic Wavemaster', icon: '🎵', earnedAt: '2 days ago' },
    { id: 'b-chem', title: 'Curcumin Colorist', icon: '🧪', earnedAt: 'Yesterday' }
  ]
};

const DEFAULT_SCORES: CompetencyScores = {
  physics: 90,
  math: 85,
  chemistry: 75,
  biology: 80,
  social: 70,
  computing: 85
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      selectedClass: 7,
      curriculumStage: 'Middle',
      userProfile: DEFAULT_PROFILE,
      competencyScores: DEFAULT_SCORES,
      topicProgress: {
        'p7-ch4-t1': { status: 'mastered', score: 92 },
        'p7-ch13-t1': { status: 'mastered', score: 95 },
        'm7-ch12-t1': { status: 'mastered', score: 100 },
        'b7-ch10-t1': { status: 'mastered', score: 88 }
      },

      setSelectedClass: (classLevel: number) => {
        let stage: 'Prep' | 'Middle' | 'Sec' | 'Senior' = 'Middle';
        if (classLevel === 5) stage = 'Prep';
        else if (classLevel >= 6 && classLevel <= 8) stage = 'Middle';
        else if (classLevel >= 9 && classLevel <= 10) stage = 'Sec';
        else if (classLevel >= 11 && classLevel <= 12) stage = 'Senior';

        set({ selectedClass: classLevel, curriculumStage: stage });
      },

      setCurriculumStage: (stage) => {
        let defaultClass = 7;
        if (stage === 'Prep') defaultClass = 5;
        if (stage === 'Middle') defaultClass = 7;
        if (stage === 'Sec') defaultClass = 10;
        if (stage === 'Senior') defaultClass = 12;

        set({ curriculumStage: stage, selectedClass: defaultClass });
      },

      addXP: (amount: number) => {
        set((state) => {
          const newXP = state.userProfile.xp + amount;
          const newLevel = Math.floor(newXP / 200) + 1;
          return {
            userProfile: {
              ...state.userProfile,
              xp: newXP,
              level: newLevel
            }
          };
        });
      },

      updateCompetencyScore: (subject, delta) => {
        set((state) => ({
          competencyScores: {
            ...state.competencyScores,
            [subject]: Math.min(100, Math.max(10, state.competencyScores[subject] + delta))
          }
        }));
      },

      completeTopicTest: (topicId, score, subjectCategory) => {
        set((state) => {
          const xpGain = Math.round((score / 100) * 50);
          const currentSubScore = state.competencyScores[subjectCategory] || 70;
          const newSubScore = Math.min(100, Math.round(currentSubScore * 0.9 + score * 0.1));

          return {
            topicProgress: {
              ...state.topicProgress,
              [topicId]: { status: 'mastered', score }
            },
            competencyScores: {
              ...state.competencyScores,
              [subjectCategory]: newSubScore
            },
            userProfile: {
              ...state.userProfile,
              xp: state.userProfile.xp + xpGain
            }
          };
        });
      },

      completeLab: (topicId, subjectCategory) => {
        set((state) => ({
          topicProgress: {
            ...state.topicProgress,
            [topicId]: { status: 'mastered', score: 100 }
          },
          competencyScores: {
            ...state.competencyScores,
            [subjectCategory]: Math.min(100, (state.competencyScores[subjectCategory] || 70) + 3)
          },
          userProfile: {
            ...state.userProfile,
            xp: state.userProfile.xp + 40,
            completedLabsCount: state.userProfile.completedLabsCount + 1
          }
        }));
      },

      getCurrentCurriculum: () => {
        const cls = get().selectedClass;
        return CURRICULUM_DATABASE[cls] || CURRICULUM_DATABASE[7];
      }
    }),
    {
      name: 'gramin-pocketlab-session',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
