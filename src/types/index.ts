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
  summaryBeginner?: string;
  summaryIntermediate?: string;
  summaryAdvanced?: string;
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
  viewsCount?: number;
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
  title?: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

// Updated N8nQuizQuestion format to match the new structure
export interface N8nQuizQuestion {
  question_number: number;
  question_text: string;
  options: {
    [key: string]: string;  // Keys like "A", "B", "C", "D"
  };
  correct_answer: string;   // Letter like "A", "B", "C", "D"
  explanation: string;
  article_id?: string;
  quiz_id?: string;
  quiz_title?: string;
}

// Updated interface for the quiz_questions table - modified to handle Json type
export interface DbQuizQuestion {
  id: string;
  quiz_id: string;
  article_id: string | null;
  question_number: number;
  question_text: string;
  options: Record<string, string> | any; // Accept any to handle Json type from Supabase
  correct_answer: string;
  explanation: string | null;
  created_at?: string;
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
  achievement?: Achievement;
}

// Profile interface that includes the leaderboard stats
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

// Chat interfaces for article chat feature
export interface ChatSession {
  id: string;
  userId: string;
  articleId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  message: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export interface ChatResponse {
  message: string;
  error?: string;
}
