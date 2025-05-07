import { Article, Category, DifficultyLevel, Quiz, UserArticleInteraction, Achievement, UserAchievement, DbQuizQuestion } from "@/types";
import { Json } from "@/integrations/supabase/types";

// Map database article to frontend Article type
export function mapDbArticleToArticle(dbArticle: any): Article {
  // Handle source field that could be either a string (JSON or plain text) or an object
  let source;
  if (typeof dbArticle.source === 'string') {
    try {
      source = JSON.parse(dbArticle.source);
    } catch (e) {
      // If parsing fails, create a source object with the string as name
      source = { 
        name: dbArticle.source, 
        url: '' 
      };
    }
  } else {
    // Already an object
    source = dbArticle.source;
  }

  return {
    id: dbArticle.id,
    title: dbArticle.title,
    summary: dbArticle.summary,
    content: dbArticle.content,
    source: source,
    publishedAt: dbArticle.published_at,
    author: dbArticle.author,
    category: dbArticle.category as Category,
    imageUrl: dbArticle.image_url,
    difficultyLevel: dbArticle.difficulty_level as DifficultyLevel,
    readTime: dbArticle.read_time,
    tags: dbArticle.tags || [],
    viewsCount: dbArticle.views_count || 0,
  };
}

// Updated mapper function to handle the new quiz question format from quiz_questions table
export function mapDbQuizToQuiz(dbQuiz: any, dbQuizQuestions: any[] = []): Quiz {
  try {
    console.log('Raw quiz data from DB:', dbQuiz);
    console.log('Quiz questions from DB:', dbQuizQuestions);
    
    // Sort questions by question number to ensure correct order
    const sortedQuestions = [...dbQuizQuestions].sort((a, b) => a.question_number - b.question_number);
    
    // Transform the questions to match our frontend Quiz type
    const transformedQuestions = sortedQuestions.map(q => {
      // Get options as an array while preserving order from A, B, C, D...
      const optionsObj = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
      const optionKeys = Object.keys(optionsObj).sort();
      const options = optionKeys.map(key => optionsObj[key]);
      
      // Find the index of the correct option based on the letter answer
      const correctAnswer = q.correct_answer;
      const correctOptionIndex = optionKeys.indexOf(correctAnswer);
      
      return {
        id: q.id,
        question: q.question_text,
        options: options,
        correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
        explanation: q.explanation || ""
      };
    });
    
    console.log('Transformed questions:', transformedQuestions);
    
    return {
      id: dbQuiz.id,
      articleId: dbQuiz.article_id,
      title: dbQuiz.title,
      questions: transformedQuestions
    };
  } catch (error) {
    console.error('Error mapping quiz data:', error, dbQuiz);
    return {
      id: dbQuiz.id || 'unknown',
      articleId: dbQuiz.article_id || 'unknown',
      questions: []
    };
  }
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
  if (!items) return [];
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
