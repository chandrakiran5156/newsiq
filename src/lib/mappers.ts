
import { Article, Category, DifficultyLevel, Quiz, UserArticleInteraction } from "@/types";
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
  };
}

// Helper to map array of items
export function mapArray<T, U>(items: T[], mapperFn: (item: T) => U): U[] {
  return items.map(mapperFn);
}
