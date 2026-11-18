import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CURRICULUM_DATABASE, ClassCurriculum, TopicActivity } from '../data/curriculumData';
import { useAppStore } from './useAppStore';

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
  badges: { id: string; title: string; icon: string; earnedAt: string; desc?: string }[];
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
  addXP: (amount: number, reason?: string) => void;
  updateCompetencyScore: (subject: keyof CompetencyScores, delta: number) => void;
  completeTopicTest: (topicId: string, score: number, subjectCategory: keyof CompetencyScores | string) => void;
  completeLab: (topicId: string, subjectCategory: keyof CompetencyScores | string) => void;
  getCurrentCurriculum: () => ClassCurriculum;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'aarav-sharma',
  name: 'Aarav Sharma',
  school: 'PM SHRI Kendriya Vidyalaya',
  board: 'CBSE (NCERT Aligned)',
  avatar: '👨‍🎓',
  level: 4,
  xp: 1450,
  streakDays: 14,
  completedLabsCount: 5,
  badges: [
    { id: 'b-wave', title: 'Sonic Wavemaster', icon: '🎵', earnedAt: '2 days ago', desc: 'Mastered harmonic wave oscillations in Class 7 Sound Lab' },
    { id: 'b-chem', title: 'Curcumin Colorist', icon: '🧪', earnedAt: 'Yesterday', desc: 'Identified alkaline indicators using turmeric reagent' },
    { id: 'b-optics', title: 'Prismatic Raytracer', icon: '🌈', earnedAt: 'Today', desc: 'Calculated critical angle and total internal reflection' },
    { id: 'b-circuits', title: 'Ohmic Engineer', icon: '⚡', earnedAt: '3 days ago', desc: 'Constructed closed circuits & verified V = I × R' },
  ]
};

const DEFAULT_SCORES: CompetencyScores = {
  physics: 92,
  math: 88,
  chemistry: 78,
  biology: 85,
  social: 74,
  computing: 95
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      selectedClass: 10,
      curriculumStage: 'Sec',
      userProfile: DEFAULT_PROFILE,
      competencyScores: DEFAULT_SCORES,
      topicProgress: {
        'p10-ch12-t1': { status: 'mastered', score: 98 },
        'p10-ch10-t1': { status: 'mastered', score: 95 },
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
        // Synchronize with useAppStore
        try {
          useAppStore.getState().setCurrentClass(classLevel);
        } catch (e) {
          // ignore if app store not ready
        }
      },

      setCurriculumStage: (stage) => {
        let defaultClass = 7;
        if (stage === 'Prep') defaultClass = 5;
        if (stage === 'Middle') defaultClass = 7;
        if (stage === 'Sec') defaultClass = 10;
        if (stage === 'Senior') defaultClass = 12;

        set({ curriculumStage: stage, selectedClass: defaultClass });
        try {
          useAppStore.getState().setCurrentClass(defaultClass);
        } catch (e) {
          // ignore
        }
      },

      addXP: (amount: number, reason?: string) => {
        set((state) => {
          const newXP = state.userProfile.xp + amount;
          const newLevel = Math.floor(newXP / 250) + 1;
          return {
            userProfile: {
              ...state.userProfile,
              xp: newXP,
              level: newLevel
            }
          };
        });
        try {
          useAppStore.getState().addXP(amount, reason);
        } catch (e) {
          // ignore
        }
      },

      updateCompetencyScore: (subject, delta) => {
        set((state) => {
          const newScore = Math.min(100, Math.max(10, state.competencyScores[subject] + delta));
          return {
            competencyScores: {
              ...state.competencyScores,
              [subject]: newScore
            }
          };
        });
        try {
          useAppStore.getState().updateCompetency(String(subject), 90);
        } catch (e) {
          // ignore
        }
      },

      completeTopicTest: (topicId, score, subjectCategory) => {
        set((state) => {
          const xpGain = Math.round((score / 100) * 80);
          const catKey = (typeof subjectCategory === 'string' ? subjectCategory.toLowerCase() : subjectCategory) as keyof CompetencyScores;
          const currentSubScore = state.competencyScores[catKey] || 75;
          const newSubScore = Math.min(100, Math.round(currentSubScore * 0.8 + score * 0.2));
          const newXP = state.userProfile.xp + xpGain;
          const newLevel = Math.floor(newXP / 250) + 1;

          return {
            topicProgress: {
              ...state.topicProgress,
              [topicId]: { status: 'mastered', score }
            },
            competencyScores: {
              ...state.competencyScores,
              [catKey]: newSubScore
            },
            userProfile: {
              ...state.userProfile,
              xp: newXP,
              level: newLevel,
              completedLabsCount: state.userProfile.completedLabsCount + 1
            }
          };
        });

        // Sync with useAppStore
        try {
          useAppStore.getState().markTopicStatus(topicId, 'mastered');
          useAppStore.getState().updateCompetency(String(subjectCategory), score);
        } catch (e) {
          // ignore
        }
      },

      completeLab: (topicId, subjectCategory) => {
        set((state) => {
          const catKey = (typeof subjectCategory === 'string' ? subjectCategory.toLowerCase() : subjectCategory) as keyof CompetencyScores;
          const currentScore = state.competencyScores[catKey] || 75;
          const newScore = Math.min(100, currentScore + 3);
          const newXP = state.userProfile.xp + 50;
          const newLevel = Math.floor(newXP / 250) + 1;

          return {
            topicProgress: {
              ...state.topicProgress,
              [topicId]: { status: 'mastered', score: 100 }
            },
            competencyScores: {
              ...state.competencyScores,
              [catKey]: newScore
            },
            userProfile: {
              ...state.userProfile,
              xp: newXP,
              level: newLevel,
              completedLabsCount: state.userProfile.completedLabsCount + 1
            }
          };
        });

        try {
          useAppStore.getState().markTopicStatus(topicId, 'mastered');
          useAppStore.getState().updateCompetency(String(subjectCategory), 98);
        } catch (e) {
          // ignore
        }
      },

      getCurrentCurriculum: () => {
        const cls = get().selectedClass;
        return CURRICULUM_DATABASE[cls] || CURRICULUM_DATABASE[10] || CURRICULUM_DATABASE[7];
      }
    }),
    {
      name: 'gramin-pocketlab-session-v2',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
