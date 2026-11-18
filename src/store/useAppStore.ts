import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userProfile, UserProfile } from '../data/curriculumData';

export type TopicStatus = 'locked' | 'ready' | 'mastered';
export type AppTheme = 'dark' | 'light';

export interface BadgeItem {
  id: string;
  title: string;
  icon: string;
  earnedAt: string;
  desc: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  due: string;
  completed: boolean;
}

export interface ToastNotification {
  message: string;
  type: 'xp' | 'badge' | 'mastery';
}

export interface AppState {
  user: UserProfile & {
    level: number;
    completedLabsCount: number;
    badges: BadgeItem[];
  };
  currentClass: number;
  activeSubject: string | null;
  topicStatuses: Record<string, TopicStatus>;
  theme: AppTheme;
  toast: ToastNotification | null;
  studyTasks: StudyTask[];

  // Actions
  setCurrentClass: (classId: number) => void;
  setActiveSubject: (subjectId: string | null) => void;
  updateCompetency: (subject: string, score: number) => void;
  addXP: (amount: number, reason?: string) => void;
  markTopicStatus: (topicId: string, status: TopicStatus) => void;
  getTopicStatus: (topicId: string, fallback?: TopicStatus) => TopicStatus;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  setToast: (toast: ToastNotification | null) => void;
  unlockBadge: (badge: Omit<BadgeItem, 'earnedAt'>) => void;
  toggleStudyTask: (id: string) => void;
  addStudyTask: (task: Omit<StudyTask, 'id' | 'completed'>) => void;
}

const DEFAULT_BADGES: BadgeItem[] = [
  { id: 'b-wave', title: 'Sonic Wavemaster', icon: '🎵', earnedAt: '2 days ago', desc: 'Mastered harmonic wave oscillations in Class 7 Sound Lab' },
  { id: 'b-chem', title: 'Curcumin Colorist', icon: '🧪', earnedAt: 'Yesterday', desc: 'Identified alkaline indicators using turmeric reagent' },
  { id: 'b-optics', title: 'Prismatic Raytracer', icon: '🌈', earnedAt: 'Today', desc: 'Calculated critical angle and total internal reflection' },
  { id: 'b-circuits', title: 'Ohmic Engineer', icon: '⚡', earnedAt: '3 days ago', desc: 'Constructed closed circuits & verified V = I × R' },
];

const DEFAULT_TASKS: StudyTask[] = [
  { id: 't1', title: 'Complete Ray Optics Snell\'s Law Challenge', subject: 'Physics', due: 'Today, 5:00 PM', completed: false },
  { id: 't2', title: 'Practice Acids, Bases & Salts Turmeric Titration', subject: 'Chemistry', due: 'Tomorrow, 10:00 AM', completed: true },
  { id: 't3', title: 'Review Fraction Slices & Prime Factorization', subject: 'Mathematics', due: 'In 2 days', completed: false },
  { id: 't4', title: 'Explore Cell Organelle 3D Structural Anatomy', subject: 'Biology', due: 'In 3 days', completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        ...userProfile,
        level: Math.floor((userProfile.xp || 1450) / 250) + 1,
        completedLabsCount: 5,
        badges: DEFAULT_BADGES,
      },
      currentClass: userProfile.classId || 10,
      activeSubject: null,
      theme: 'dark',
      toast: null,
      studyTasks: DEFAULT_TASKS,
      topicStatuses: {
        'p10-ch12-t1': 'mastered',
        'p10-ch10-t1': 'mastered',
        'm10-ch4-t1': 'ready',
        'c10-ch1-t1': 'ready',
        'p7-ch13-t1': 'mastered',
        'm5-ch4-t1': 'ready',
        'p12-ch9-t1': 'ready',
      },

      setCurrentClass: (classId: number) => {
        set((state) => ({
          currentClass: classId,
          user: {
            ...state.user,
            classId,
          },
        }));
      },

      setActiveSubject: (subjectId: string | null) => {
        set({ activeSubject: subjectId });
      },

      addXP: (amount: number, reason?: string) => {
        set((state) => {
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 250) + 1;
          const leveledUp = newLevel > state.user.level;

          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
            toast: {
              message: leveledUp
                ? `🎉 LEVEL UP! You reached Level ${newLevel}! (+${amount} XP)`
                : `+${amount} XP Earned! ${reason || ''}`.trim(),
              type: 'xp',
            },
          };
        });
      },

      updateCompetency: (subject: string, score: number) => {
        set((state) => {
          // Normalize subject key
          const subKey = Object.keys(state.user.competencies).find(
            (k) => k.toLowerCase() === subject.toLowerCase()
          ) || subject;

          const currentScore = state.user.competencies[subKey] ?? 75;
          const newScore = Math.min(100, Math.max(10, Math.round((currentScore * 0.7) + (score * 0.3))));
          const xpGain = Math.max(30, Math.round(score * 0.8));
          const newXP = state.user.xp + xpGain;
          const newLevel = Math.floor(newXP / 250) + 1;

          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
              competencies: {
                ...state.user.competencies,
                [subKey]: newScore,
              },
            },
            toast: {
              message: `+${xpGain} XP! ${subject} Mastery updated to ${newScore}%`,
              type: 'mastery',
            },
          };
        });
      },

      markTopicStatus: (topicId: string, status: TopicStatus) => {
        set((state) => {
          const wasMastered = state.topicStatuses[topicId] === 'mastered';
          const newCompletedCount =
            status === 'mastered' && !wasMastered
              ? state.user.completedLabsCount + 1
              : state.user.completedLabsCount;

          return {
            topicStatuses: {
              ...state.topicStatuses,
              [topicId]: status,
            },
            user: {
              ...state.user,
              completedLabsCount: newCompletedCount,
            },
            toast: status === 'mastered'
              ? { message: '🏆 Topic Mastered! +100 XP added to your Learning Portfolio.', type: 'mastery' }
              : null,
          };
        });
      },

      getTopicStatus: (topicId: string, fallback: TopicStatus = 'ready') => {
        const statuses = get().topicStatuses;
        return statuses[topicId] || fallback;
      },

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        }));
      },

      setTheme: (theme: AppTheme) => {
        set({ theme });
      },

      setToast: (toast: ToastNotification | null) => {
        set({ toast });
      },

      unlockBadge: (badge: Omit<BadgeItem, 'earnedAt'>) => {
        set((state) => {
          if (state.user.badges.some((b) => b.id === badge.id)) return state;
          const newBadge: BadgeItem = {
            ...badge,
            earnedAt: 'Just now',
          };
          return {
            user: {
              ...state.user,
              badges: [newBadge, ...state.user.badges],
              xp: state.user.xp + 150,
            },
            toast: {
              message: `🌟 Badge Unlocked: ${badge.title}! (+150 XP)`,
              type: 'badge',
            },
          };
        });
      },

      toggleStudyTask: (id: string) => {
        set((state) => {
          const updated = state.studyTasks.map((t) => {
            if (t.id === id) {
              const completed = !t.completed;
              return { ...t, completed };
            }
            return t;
          });
          const completedTask = state.studyTasks.find((t) => t.id === id && !t.completed);
          if (completedTask) {
            get().addXP(25, 'Study Task Complete');
          }
          return { studyTasks: updated };
        });
      },

      addStudyTask: (task) => {
        set((state) => ({
          studyTasks: [
            ...state.studyTasks,
            {
              ...task,
              id: `task-${Date.now()}`,
              completed: false,
            },
          ],
          toast: {
            message: `Task added to Study Planner!`,
            type: 'mastery',
          },
        }));
      },
    }),
    {
      name: 'pocketlab-app-store-v2',
    }
  )
);
