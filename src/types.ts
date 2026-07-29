export type ChallengeCategory = 'bienestar' | 'salud' | 'educacion' | 'entretenimiento';
export type ChallengeFrequency = 'daily' | 'weekly' | 'monthly';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  frequency: ChallengeFrequency;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  completedAt?: string;
  evidenceNote?: string;
  evidenceImage?: string;
  iconName: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: ChallengeCategory | 'game' | 'general';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpBonus: number;
}

export interface UserProfile {
  name: string;
  username: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  streakDays: number;
  completedChallengesCount: number;
  activeHours: number;
  selectedTheme: 'emerald' | 'indigo' | 'amber' | 'rose' | 'dark';
  title: string;
  unlockedTitles: string[];
  badges: Badge[];
  claimedMilestones?: number[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'challenge' | 'reminder' | 'gym' | 'study' | 'custom';
  category?: ChallengeCategory;
  color: string;
  completed: boolean;
  notes?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  color: string;
  updatedAt: string;
  checklists?: { id: string; text: string; done: boolean }[];
  imageUrl?: string;
}

export interface HighScore {
  id: string;
  playerName: string;
  score: number;
  timeSeconds: number;
  levelReached: number;
  date: string;
}

export interface PostComment {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  timestamp: string;
  likes?: number;
  likedByMe?: boolean;
}

export interface CommunityPost {
  id: string;
  username: string;
  avatarUrl: string;
  challengeTitle: string;
  category: ChallengeCategory;
  comment: string;
  imageUrl?: string;
  likes: number;
  likedByMe?: boolean;
  timestamp: string;
  commentsCount: number;
  commentsList?: PostComment[];
  repostsCount?: number;
  repostedByMe?: boolean;
  originalAuthor?: string;
  reactionBadge?: string;
}

export type QrColorTheme = 'slate' | 'emerald' | 'indigo' | 'amber' | 'rose';

export interface QrAccessBadge {
  id: string;
  title: string;
  userType: 'guest' | 'vip' | 'staff' | 'member';
  timestamp: string;
  code: string;
}

export interface AccessLog {
  id: string;
  badgeTitle: string;
  userType: string;
  scannedAt: string;
  deviceInfo: string;
  status: 'authorized' | 'pending';
}
