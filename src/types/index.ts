
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type Category = 
  | 'technology' 
  | 'science' 
  | 'politics' 
  | 'business'
  | 'health' 
  | 'sports' 
  | 'entertainment' 
  | 'education'
  | 'finance';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  categories: Category[];
  difficultyLevel: DifficultyLevel;
  languages: string[];
  notificationTimes: string[];
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: {
    name: string;
    url: string;
  };
  publishedAt: string;
  author: string;
  category: Category;
  imageUrl: string;
  difficultyLevel: DifficultyLevel;
  readTime: number; // in minutes
  tags: string[];
  viewsCount?: number; // Add this to fix the type error
}

export interface UserArticleInteraction {
  id: string;
  userId: string;
  articleId: string;
  isRead: boolean;
  isSaved: boolean;
  interactedAt: string;
  readProgress?: number;
}

export interface Quiz {
  id: string;
  articleId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  answers: {
    questionId: string;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
  completedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
  achievement?: Achievement; // Add this property to connect to the Achievement
}

// Add a profile interface that includes the leaderboard stats
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  quizzes_taken?: number;
  avg_quiz_score?: number;
  current_streak?: number;
}
