
import { supabase } from '@/integrations/supabase/client';
import { Article, UserArticleInteraction, Quiz, Category, DifficultyLevel } from '@/types';
import { 
  mapDbArticleToArticle, 
  mapDbQuizToQuiz, 
  mapDbInteractionToInteraction, 
  mapArray 
} from './mappers';

// Article API
export async function fetchArticles({
  limit = 200, // Increased default limit to show all articles
  offset = 0,
  category = null,
  difficultyLevel = null,
  search = '',
  sortBy = 'newest',
}: {
  limit?: number;
  offset?: number;
  category?: Category | null;
  difficultyLevel?: DifficultyLevel | null;
  search?: string;
  sortBy?: string;
}) {
  try {
    console.log('Fetching articles with params:', { limit, offset, category, difficultyLevel, search, sortBy });
    
    let query = supabase
      .from('articles')
      .select('*');
    
    // Apply sort order
    switch (sortBy) {
      case 'oldest':
        query = query.order('published_at', { ascending: true });
        break;
      case 'most-read':
        query = query.order('views_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false });
        break;
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    if (offset > 0) {
      query = query.range(offset, offset + limit - 1);
    }

    if (category) {
      query = query.eq('category', category);
    }

    if (difficultyLevel) {
      query = query.eq('difficulty_level', difficultyLevel);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,tags.cs.{${search}}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles:', error);
      throw new Error(error.message);
    }

    console.log(`Successfully fetched ${data?.length || 0} articles`);
    return mapArray(data || [], mapDbArticleToArticle);
  } catch (err) {
    console.error('Error in fetchArticles:', err);
    throw err;
  }
}

export async function fetchArticleById(id: string) {
  try {
    console.log('Fetching article by id:', id);
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article:', error);
      throw new Error(error.message);
    }

    console.log('Article fetched successfully');
    return mapDbArticleToArticle(data);
  } catch (err) {
    console.error('Error in fetchArticleById:', err);
    throw err;
  }
}

export async function fetchTrendingArticles(limit = 5) {
  try {
    console.log('Fetching trending articles, limit:', limit);
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching trending articles:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} trending articles`);
    return mapArray(data || [], mapDbArticleToArticle);
  } catch (err) {
    console.error('Error in fetchTrendingArticles:', err);
    throw err;
  }
}

export async function fetchArticlesByUserPreference(userId: string, limit = 100) {
  try {
    console.log('Fetching articles by user preference for user:', userId);
    
    // First get user preferences
    const { data: preferences, error: prefError } = await supabase
      .from('user_preferences')
      .select('categories, difficulty_level')
      .eq('user_id', userId)
      .single();

    if (prefError) {
      console.error('Error fetching user preferences:', prefError);
      throw new Error(prefError.message);
    }

    if (!preferences || !preferences.categories || preferences.categories.length === 0) {
      console.log('No preferences found, fetching default articles');
      return fetchArticles({ limit });
    }

    // Then fetch articles based on those preferences
    let query = supabase
      .from('articles')
      .select('*')
      .in('category', preferences.categories)
      .order('published_at', { ascending: false })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles by preference:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} personalized articles`);
    return mapArray(data || [], mapDbArticleToArticle);
  } catch (err) {
    console.error('Error in fetchArticlesByUserPreference:', err);
    throw err;
  }
}

// Article interactions API
export async function saveArticleInteraction(
  userId: string, 
  articleId: string, 
  isRead = false, 
  isSaved = false,
  readProgress = 0
) {
  try {
    console.log('Saving article interaction:', { userId, articleId, isRead, isSaved, readProgress });
    
    // Check if interaction exists
    const { data: existing, error: checkError } = await supabase
      .from('user_article_interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking article interaction:', checkError);
      throw new Error(checkError.message);
    }

    if (existing) {
      // Update existing interaction
      const { error } = await supabase
        .from('user_article_interactions')
        .update({
          is_read: isRead,
          is_saved: isSaved,
          read_progress: readProgress,
          interacted_at: new Date().toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating article interaction:', error);
        throw new Error(error.message);
      }
    } else {
      // Insert new interaction
      const { error } = await supabase
        .from('user_article_interactions')
        .insert({
          user_id: userId,
          article_id: articleId,
          is_read: isRead,
          is_saved: isSaved,
          read_progress: readProgress
        });

      if (error) {
        console.error('Error saving article interaction:', error);
        throw new Error(error.message);
      }
    }

    // If marked as read, update user reading streak
    if (isRead) {
      await updateReadingStreak(userId);
    }

    console.log('Article interaction saved successfully');
    return true;
  } catch (err) {
    console.error('Error in saveArticleInteraction:', err);
    throw err;
  }
}

export async function getUserArticleInteraction(userId: string, articleId: string) {
  try {
    console.log('Getting user article interaction:', { userId, articleId });
    
    const { data, error } = await supabase
      .from('user_article_interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article interaction:', error);
      throw new Error(error.message);
    }

    return data ? mapDbInteractionToInteraction(data) : null;
  } catch (err) {
    console.error('Error in getUserArticleInteraction:', err);
    throw err;
  }
}

export async function getSavedArticles(userId: string) {
  try {
    console.log('Fetching saved articles for user:', userId);
    
    const { data, error } = await supabase
      .from('user_article_interactions')
      .select('*, articles(*)')
      .eq('user_id', userId)
      .eq('is_saved', true);

    if (error) {
      console.error('Error fetching saved articles:', error);
      throw new Error(error.message);
    }

    // Restructure the data to get the articles
    const articles = data.filter(item => item.articles).map(item => item.articles);
    console.log(`Fetched ${articles.length} saved articles`);
    return mapArray(articles, mapDbArticleToArticle);
  } catch (err) {
    console.error('Error in getSavedArticles:', err);
    throw err;
  }
}

export async function getReadArticles(userId: string) {
  try {
    console.log('Fetching read articles for user:', userId);
    
    const { data, error } = await supabase
      .from('user_article_interactions')
      .select('*, articles(*)')
      .eq('user_id', userId)
      .eq('is_read', true)
      .order('interacted_at', { ascending: false });

    if (error) {
      console.error('Error fetching read articles:', error);
      throw new Error(error.message);
    }

    // Restructure the data to get the articles
    const articles = data.filter(item => item.articles).map(item => item.articles);
    console.log(`Fetched ${articles.length} read articles`);
    return mapArray(articles, mapDbArticleToArticle);
  } catch (err) {
    console.error('Error in getReadArticles:', err);
    throw err;
  }
}

// Quiz API
export async function fetchQuizByArticleId(articleId: string) {
  try {
    console.log('Fetching quiz for article:', articleId);
    
    // First, get the quiz record for this article
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('article_id', articleId)
      .maybeSingle();

    if (quizError) {
      console.error('Error fetching quiz:', quizError);
      throw new Error(quizError.message);
    }

    if (!quizData) {
      console.log('No quiz found for article:', articleId);
      return null;
    }
    
    // Now fetch the questions for this quiz using quiz_id instead of article_id
    const { data: questionData, error: questionError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizData.id)
      .order('question_number', { ascending: true });
      
    if (questionError) {
      console.error('Error fetching quiz questions:', questionError);
      throw new Error(questionError.message);
    }
    
    console.log('Quiz questions fetched:', questionData);
    
    // Transform the quiz data
    const transformedQuiz = mapDbQuizToQuiz(quizData, questionData);
    console.log('Quiz fetched and transformed:', transformedQuiz);
    
    return transformedQuiz;
  } catch (err) {
    console.error('Error in fetchQuizByArticleId:', err);
    throw err;
  }
}

export async function submitQuizAttempt(
  userId: string, 
  quizId: string, 
  score: number, 
  answers: any[]
) {
  try {
    console.log('Submitting quiz attempt:', { userId, quizId, score });
    
    // Save quiz attempt
    const { error: attemptError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        answers
      });

    if (attemptError) {
      console.error('Error saving quiz attempt:', attemptError);
      throw new Error(attemptError.message);
    }

    // Update leaderboard points
    const pointsToAdd = Math.round(score * 10); // 10 points per correct answer
    await updateLeaderboardPoints(userId, pointsToAdd);

    // Check and award achievements
    await checkQuizAchievements(userId);

    console.log('Quiz attempt submitted successfully');
    return true;
  } catch (err) {
    console.error('Error in submitQuizAttempt:', err);
    throw err;
  }
}

// User data API
export async function fetchUserProfile(userId: string) {
  try {
    console.log('Fetching user profile:', userId);
    
    // First try to get the user from the leaderboard view which has the stats
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard_view')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (leaderboardData) {
      console.log('User profile fetched from leaderboard view');
      return leaderboardData;
    }
    
    // Fallback to profile table if no leaderboard data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) throw profileError;
    
    console.log('User profile fetched from profiles table');
    return profileData;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, updates: Partial<any>) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error.message);
    }

    console.log('User profile updated successfully');
    return true;
  } catch (err) {
    console.error('Error in updateUserProfile:', err);
    throw err;
  }
}

export async function fetchUserPreferences(userId: string) {
  try {
    console.log('Fetching user preferences:', userId);
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      throw new Error(error.message);
    }

    console.log('User preferences fetched successfully');
    return data;
  } catch (err) {
    console.error('Error in fetchUserPreferences:', err);
    throw err;
  }
}

export async function updateUserPreferences(userId: string, preferences: any) {
  try {
    const { error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating user preferences:', error);
      throw new Error(error.message);
    }

    console.log('User preferences updated successfully');
    return true;
  } catch (err) {
    console.error('Error in updateUserPreferences:', err);
    throw err;
  }
}

// Leaderboard API
export async function fetchLeaderboard(limit = 10) {
  try {
    console.log('Fetching leaderboard, limit:', limit);
    
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} leaderboard entries`);
    return data;
  } catch (err) {
    console.error('Error in fetchLeaderboard:', err);
    throw err;
  }
}

export async function fetchWeeklyLeaderboard(limit = 10) {
  try {
    console.log('Fetching weekly leaderboard, limit:', limit);
    
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('weekly_points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching weekly leaderboard:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} weekly leaderboard entries`);
    return data;
  } catch (err) {
    console.error('Error in fetchWeeklyLeaderboard:', err);
    throw err;
  }
}

export async function fetchUserLeaderboardPosition(userId: string) {
  try {
    console.log('Fetching leaderboard position for user:', userId);
    
    // First get all users ordered by points
    const { data, error } = await supabase
      .from('leaderboard_points')
      .select('user_id, points')
      .order('points', { ascending: false });

    if (error) {
      console.error('Error fetching leaderboard position:', error);
      throw new Error(error.message);
    }

    // Find user's position
    const position = data.findIndex(user => user.user_id === userId) + 1;
    console.log(`User ${userId} is at position ${position}`);
    return position;
  } catch (err) {
    console.error('Error in fetchUserLeaderboardPosition:', err);
    throw err;
  }
}

// Achievements API
export async function fetchUserAchievements(userId: string) {
  try {
    console.log('Fetching achievements for user:', userId);
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} user achievements`);
    return data;
  } catch (err) {
    console.error('Error in fetchUserAchievements:', err);
    throw err;
  }
}

export async function fetchAllAchievements() {
  try {
    console.log('Fetching all achievements');
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*');

    if (error) {
      console.error('Error fetching achievements:', error);
      throw new Error(error.message);
    }

    console.log(`Fetched ${data?.length || 0} achievements`);
    return data;
  } catch (err) {
    console.error('Error in fetchAllAchievements:', err);
    throw err;
  }
}

// Helper functions
async function updateReadingStreak(userId: string) {
  try {
    // Get current streak info
    const { data: streak, error: streakError } = await supabase
      .from('reading_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (streakError) {
      console.error('Error fetching reading streak:', streakError);
      throw new Error(streakError.message);
    }

    if (!streak) {
      console.log('No streak record found, creating initial record');
      const { error } = await supabase
        .from('reading_streaks')
        .insert({
          user_id: userId,
          current_streak: 1,
          longest_streak: 1,
          last_read_date: new Date().toISOString().split('T')[0]
        });
        
      if (error) {
        console.error('Error creating initial reading streak:', error);
      }
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    const lastReadDate = streak.last_read_date ? new Date(streak.last_read_date).toISOString().split('T')[0] : null;

    if (!lastReadDate) {
      console.log('No last read date found, updating with current date');
      const { error } = await supabase
        .from('reading_streaks')
        .update({
          current_streak: 1,
          longest_streak: 1,
          last_read_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error updating reading streak:', error);
      }
      return true;
    }

    let newStreak = streak.current_streak || 0;
    let longestStreak = streak.longest_streak || 0;

    // If last read was yesterday, increment streak
    if (isYesterday(lastReadDate, today)) {
      newStreak += 1;
    } 
    // If last read was today, do nothing
    else if (lastReadDate !== today) {
      // Reset streak if not read yesterday
      newStreak = 1;
    }

    // Update longest streak if needed
    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    // Update streak in database
    const { error } = await supabase
      .from('reading_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_read_date: today,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating reading streak:', error);
      throw new Error(error.message);
    }

    // Check and award streak achievements
    if (newStreak >= 7) {
      await checkAndAwardAchievement(userId, 'Streak Hunter');
    }

    console.log(`Updated reading streak to ${newStreak} days`);
    return true;
  } catch (err) {
    console.error('Error in updateReadingStreak:', err);
    return false;
  }
}

function isYesterday(date1: string, date2: string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // Set both dates to midnight
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // Calculate the difference in days
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
}

async function updateLeaderboardPoints(userId: string, pointsToAdd: number) {
  try {
    // Get current points
    const { data: points, error: pointsError } = await supabase
      .from('leaderboard_points')
      .select('points, weekly_points, monthly_points')
      .eq('user_id', userId)
      .maybeSingle();

    if (pointsError) {
      console.error('Error fetching leaderboard points:', pointsError);
      throw new Error(pointsError.message);
    }

    if (!points) {
      console.log('No leaderboard points record found, creating initial record');
      const { error } = await supabase
        .from('leaderboard_points')
        .insert({
          user_id: userId,
          points: pointsToAdd,
          weekly_points: pointsToAdd,
          monthly_points: pointsToAdd
        });
        
      if (error) {
        console.error('Error creating initial leaderboard points:', error);
      }
      return true;
    }

    // Update points
    const { error } = await supabase
      .from('leaderboard_points')
      .update({
        points: (points.points || 0) + pointsToAdd,
        weekly_points: (points.weekly_points || 0) + pointsToAdd,
        monthly_points: (points.monthly_points || 0) + pointsToAdd,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating leaderboard points:', error);
      throw new Error(error.message);
    }

    console.log(`Added ${pointsToAdd} points to user ${userId}`);
    return true;
  } catch (err) {
    console.error('Error in updateLeaderboardPoints:', err);
    return false;
  }
}

async function checkQuizAchievements(userId: string) {
  try {
    // Count perfect quiz scores
    const { count, error: countError } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('score', 100);

    if (countError) {
      console.error('Error counting perfect quizzes:', countError);
      return;
    }

    console.log(`User ${userId} has ${count} perfect quizzes`);
    
    // Award Quiz Master for 5 perfect quizzes
    if (count && count >= 5) {
      await checkAndAwardAchievement(userId, 'Quiz Master');
    }
  } catch (err) {
    console.error('Error in checkQuizAchievements:', err);
  }
}

async function checkAndAwardAchievement(userId: string, achievementName: string) {
  try {
    console.log(`Checking achievement "${achievementName}" for user ${userId}`);
    
    // Find achievement ID
    const { data: achievement, error: achError } = await supabase
      .from('achievements')
      .select('id')
      .eq('name', achievementName)
      .maybeSingle();

    if (achError || !achievement) {
      console.error('Error finding achievement:', achError);
      return;
    }

    // Check if user already has this achievement
    const { data: existing, error: existError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievement.id)
      .maybeSingle();

    if (existError) {
      console.error('Error checking existing achievement:', existError);
      return;
    }

    // If not already awarded, award it now
    if (!existing) {
      console.log(`Awarding achievement "${achievementName}" to user ${userId}`);
      
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id
        });

      if (error) {
        console.error('Error awarding achievement:', error);
        return;
      }
      
      console.log(`Achievement "${achievementName}" awarded to user ${userId}`);
    } else {
      console.log(`User ${userId} already has achievement "${achievementName}"`);
    }

    return true;
  } catch (err) {
    console.error('Error in checkAndAwardAchievement:', err);
    return false;
  }
}
