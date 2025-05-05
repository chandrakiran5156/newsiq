import { Article, Category, DifficultyLevel, Quiz, UserArticleInteraction, Achievement, UserAchievement } from "@/types";
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

// Map database quiz to frontend Quiz type
export function mapDbQuizToQuiz(dbQuiz: any): Quiz {
  try {
    console.log('Raw quiz data from DB:', dbQuiz);
    let questions = [];
    
    // Handle the case where questions is a string (JSON)
    if (dbQuiz.questions && typeof dbQuiz.questions === 'string') {
      try {
        questions = JSON.parse(dbQuiz.questions);
      } catch (e) {
        console.error('Failed to parse quiz questions:', e);
        questions = [];
      }
    } 
    // Handle the case where questions is already an object (JSONB from Postgres)
    else if (dbQuiz.questions && typeof dbQuiz.questions === 'object') {
      // If it's an array, use it directly
      if (Array.isArray(dbQuiz.questions)) {
        questions = dbQuiz.questions;
      } 
      // If it's a JSONB object from Postgres
      else {
        questions = dbQuiz.questions;
      }
    }
    
    console.log('Extracted questions before transformation:', questions);
    
    // Transform the questions to match our frontend Quiz type
    const transformedQuestions = Array.isArray(questions) ? questions.map(q => {
      // Check if we have the new format with question_number, question_text, etc.
      if (q.question_text) {
        // Get options as an array, preserving the order from A, B, C, D, etc.
        const optionKeys = Object.keys(q.options || {}).sort();
        const options = optionKeys.map(key => q.options[key]);
        
        // Find the index of the correct option based on the letter (A, B, C, D)
        const correctAnswer = q.correct_answer;
        const correctOptionIndex = optionKeys.indexOf(correctAnswer);
        
        // Default to 0 if the correct answer isn't found
        const finalCorrectIndex = correctOptionIndex === -1 ? 0 : correctOptionIndex;
        
        return {
          id: q.question_number.toString(),
          question: q.question_text,
          options: options,
          correctOptionIndex: finalCorrectIndex,
          explanation: q.explanation || ""
        };
      }
      
      // Return the original format if it doesn't match the new format
      return q;
    }) : [];
    
    console.log('Transformed questions:', transformedQuestions);

    // Make sure we're associating the quiz with the correct article ID
    const articleId = dbQuiz.article_id;
    
    return {
      id: dbQuiz.id,
      articleId: articleId,
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
