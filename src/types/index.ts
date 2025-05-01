
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type Category = 
  | 'technology' 
  | 'science' 
  | 'politics' 
  | 'business'
  | 'health' 
  | 'sports' 
  | 'entertainment' 
  | 'education';

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
}

export interface UserArticleInteraction {
  id: string;
  userId: string;
  articleId: string;
  isRead: boolean;
  isSaved: boolean;
  interactedAt: string;
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
}
