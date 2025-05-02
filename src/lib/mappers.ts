
import { Article, Category, DifficultyLevel, Quiz, UserArticleInteraction, Achievement, UserAchievement } from "@/types";
import { Json } from "@/integrations/supabase/types";

// Map database article to frontend Article type
export function mapDbArticleToArticle(dbArticle: any): Article {
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    summary: dbArticle.summary,
    content: dbArticle.content,
    source: typeof dbArticle.source === 'string' ? JSON.parse(dbArticle.source) : dbArticle.source,
    publishedAt: dbArticle.published_at,
    author: dbArticle.author,
    category: dbArticle.category as Category,
    imageUrl: dbArticle.image_url,
    difficultyLevel: dbArticle.difficulty_level as DifficultyLevel,
    readTime: dbArticle.read_time,
    tags: dbArticle.tags || [],
  };
}

// Map database quiz to frontend Quiz type
export function mapDbQuizToQuiz(dbQuiz: any): Quiz {
  return {
    id: dbQuiz.id,
    articleId: dbQuiz.article_id,
    questions: Array.isArray(dbQuiz.questions) ? dbQuiz.questions : [],
  };
}

// Map database interaction to frontend UserArticleInteraction type
export function mapDbInteractionToInteraction(dbInteraction: any): UserArticleInteraction {
  return {
    id: dbInteraction.id,
    userId: dbInteraction.user_id,
    articleId: dbInteraction.article_id,
    isRead: dbInteraction.is_read,
    isSaved: dbInteraction.is_saved,
    interactedAt: dbInteraction.interacted_at,
    readProgress: dbInteraction.read_progress || 0,
  };
}

// Map database achievement to frontend Achievement type
export function mapDbAchievementToAchievement(dbAchievement: any): Achievement {
  return {
    id: dbAchievement.id,
    name: dbAchievement.name,
    description: dbAchievement.description,
    iconUrl: dbAchievement.icon_url,
    criteria: dbAchievement.criteria,
    createdAt: dbAchievement.created_at,
  };
}

// Map database user achievement to frontend UserAchievement type
export function mapDbUserAchievementToUserAchievement(dbUserAchievement: any): UserAchievement {
  const result: UserAchievement = {
    id: dbUserAchievement.id,
    userId: dbUserAchievement.user_id,
    achievementId: dbUserAchievement.achievement_id,
    earnedAt: dbUserAchievement.earned_at,
  };
  
  // Only add the achievement property if it exists in the database response
  if (dbUserAchievement.achievements) {
    result.achievement = mapDbAchievementToAchievement(dbUserAchievement.achievements);
  }
  
  return result;
}

// Helper to map array of items
export function mapArray<T, U>(items: T[], mapperFn: (item: T) => U): U[] {
  return items.map(mapperFn);
}

// Map profile data
export function mapDbProfileToUserProfile(profile: any) {
  return {
    id: profile.id,
    username: profile.username,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    email: profile.email,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    quizzes_taken: profile.quizzes_taken || 0,
    avg_quiz_score: profile.avg_quiz_score || 0,
    current_streak: profile.current_streak || 0
  };
}
