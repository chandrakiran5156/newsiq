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
  limit = 10,
  category = null,
  difficultyLevel = null,
  search = '',
}: {
  limit?: number;
  category?: Category | null;
  difficultyLevel?: DifficultyLevel | null;
  search?: string;
}) {
  let query = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq('category', category);
  }

  if (difficultyLevel) {
    query = query.eq('difficulty_level', difficultyLevel);
  }

  if (search) {
    query = query.textSearch('title', search, { 
      config: 'english',
      type: 'websearch'
    });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    throw new Error(error.message);
  }

  return mapArray(data || [], mapDbArticleToArticle);
}

export async function fetchArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    throw new Error(error.message);
  }

  return mapDbArticleToArticle(data);
}

export async function fetchTrendingArticles(limit = 5) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('views_count', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching trending articles:', error);
    throw new Error(error.message);
  }

  return mapArray(data || [], mapDbArticleToArticle);
}

export async function fetchArticlesByUserPreference(userId: string, limit = 10) {
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

  return mapArray(data || [], mapDbArticleToArticle);
}

// Article interactions API
export async function saveArticleInteraction(
  userId: string, 
  articleId: string, 
  isRead = false, 
  isSaved = false,
  readProgress = 0
) {
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

  return true;
}

export async function getUserArticleInteraction(userId: string, articleId: string) {
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
}

export async function getSavedArticles(userId: string) {
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
  return mapArray(data.map(item => item.articles), mapDbArticleToArticle);
}

export async function getReadArticles(userId: string) {
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
  return mapArray(data.map(item => item.articles), mapDbArticleToArticle);
}

// Quiz API
export async function fetchQuizByArticleId(articleId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('article_id', articleId)
    .single();

  if (error) {
    console.error('Error fetching quiz:', error);
    throw new Error(error.message);
  }

  return mapDbQuizToQuiz(data);
}

export async function submitQuizAttempt(
  userId: string, 
  quizId: string, 
  score: number, 
  answers: any[]
) {
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

  return true;
}

// User data API
export async function fetchUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<any>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message);
  }

  return true;
}

export async function fetchUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function updateUserPreferences(userId: string, preferences: any) {
  const { error } = await supabase
    .from('user_preferences')
    .update(preferences)
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating user preferences:', error);
    throw new Error(error.message);
  }

  return true;
}

// Leaderboard API
export async function fetchLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard_view')
    .select('*')
    .order('points', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchWeeklyLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('leaderboard_view')
    .select('*')
    .order('weekly_points', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching weekly leaderboard:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchUserLeaderboardPosition(userId: string) {
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
  return position;
}

// Achievements API
export async function fetchUserAchievements(userId: string) {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*, achievements(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user achievements:', error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchAllAchievements() {
  const { data, error } = await supabase
    .from('achievements')
    .select('*');

  if (error) {
    console.error('Error fetching achievements:', error);
    throw new Error(error.message);
  }

  return data;
}

// Helper functions
async function updateReadingStreak(userId: string) {
  // Get current streak info
  const { data: streak, error: streakError } = await supabase
    .from('reading_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (streakError) {
    console.error('Error fetching reading streak:', streakError);
    throw new Error(streakError.message);
  }

  const today = new Date().toISOString().split('T')[0];
  const lastReadDate = new Date(streak.last_read_date).toISOString().split('T')[0];

  let newStreak = streak.current_streak;
  let longestStreak = streak.longest_streak;

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

  return true;
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
  // Get current points
  const { data: points, error: pointsError } = await supabase
    .from('leaderboard_points')
    .select('points, weekly_points, monthly_points')
    .eq('user_id', userId)
    .single();

  if (pointsError) {
    console.error('Error fetching leaderboard points:', pointsError);
    throw new Error(pointsError.message);
  }

  // Update points
  const { error } = await supabase
    .from('leaderboard_points')
    .update({
      points: points.points + pointsToAdd,
      weekly_points: points.weekly_points + pointsToAdd,
      monthly_points: points.monthly_points + pointsToAdd,
      last_updated: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating leaderboard points:', error);
    throw new Error(error.message);
  }

  return true;
}

async function checkQuizAchievements(userId: string) {
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

  // Award Quiz Master for 5 perfect quizzes
  if (count && count >= 5) {
    await checkAndAwardAchievement(userId, 'Quiz Master');
  }
}

async function checkAndAwardAchievement(userId: string, achievementName: string) {
  // Find achievement ID
  const { data: achievement, error: achError } = await supabase
    .from('achievements')
    .select('id')
    .eq('name', achievementName)
    .single();

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
  }

  return true;
}
