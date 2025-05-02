
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Trophy } from 'lucide-react';
import { useAuth } from '@/lib/supabase-auth';
import { fetchUserProfile, fetchUserAchievements, getReadArticles, getSavedArticles } from '@/lib/api';
import { mapArray, mapDbUserAchievementToUserAchievement } from '@/lib/mappers';
import ArticleList from '@/components/articles/ArticleList';
import UserPreferences from '@/components/profile/UserPreferences';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch user profile
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: () => user ? fetchUserProfile(user.id) : Promise.reject('No user'),
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch user profile:', error);
      }
    }
  });

  // Fetch user achievements
  const { data: achievements, isLoading: isAchievementsLoading } = useQuery({
    queryKey: ['userAchievements', user?.id],
    queryFn: () => user ? fetchUserAchievements(user.id) : Promise.reject('No user'),
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch user achievements:', error);
      }
    }
  });

  // Fetch read articles
  const { data: readArticles, isLoading: isReadLoading } = useQuery({
    queryKey: ['readArticles', user?.id],
    queryFn: () => user ? getReadArticles(user.id) : Promise.reject('No user'),
    enabled: !!user && activeTab === 'reading-history',
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch read articles:', error);
      }
    }
  });

  // Fetch saved articles
  const { data: savedArticles, isLoading: isSavedLoading } = useQuery({
    queryKey: ['savedArticles', user?.id],
    queryFn: () => user ? getSavedArticles(user.id) : Promise.reject('No user'),
    enabled: !!user && activeTab === 'saved',
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch saved articles:', error);
      }
    }
  });

  const mappedAchievements = achievements ? mapArray(achievements, mapDbUserAchievementToUserAchievement) : [];

  // Get stats from the leaderboard view
  const quizzesTaken = profile?.quizzes_taken || 0;
  const avgQuizScore = profile?.avg_quiz_score || 0;
  const currentStreak = profile?.current_streak || 0;

  if (!user) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.username || 'User'} />
                  <AvatarFallback>
                    {profile?.username?.substring(0, 2).toUpperCase() || user.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{profile?.full_name || profile?.username || 'User'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{currentStreak || 0}</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{readArticles?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Articles Read</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{quizzesTaken || 0}</p>
                  <p className="text-xs text-muted-foreground">Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isAchievementsLoading ? (
                <div className="text-center p-4">Loading achievements...</div>
              ) : mappedAchievements.length > 0 ? (
                <div className="space-y-3">
                  {mappedAchievements.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <Award className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{item.achievement?.name}</p>
                        <p className="text-xs text-muted-foreground">{item.achievement?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No achievements yet</p>
                </div>
              )}
            </CardContent>
            {mappedAchievements.length > 3 && (
              <CardFooter>
                <button 
                  className="text-sm text-primary hover:underline"
                  onClick={() => setActiveTab('achievements')}
                >
                  View all {mappedAchievements.length} achievements
                </button>
              </CardFooter>
            )}
          </Card>

          {/* Topic Preferences */}
          <UserPreferences />
        </div>

        {/* Main Content */}
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reading-history">Read</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">Quiz Average</p>
                      <div className="h-2 bg-muted rounded-full mt-1">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${avgQuizScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-right mt-1">{Math.round(Number(avgQuizScore))}%</p>
                    </div>
                    <div>
                      <p className="font-medium">Reading Streak</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-2xl font-bold flex items-center text-primary">
                          <BookOpen className="h-5 w-5 mr-2" />
                          {currentStreak} days
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recently Read</CardTitle>
                </CardHeader>
                <CardContent>
                  {isReadLoading ? (
                    <div className="text-center p-4">Loading articles...</div>
                  ) : readArticles && readArticles.length > 0 ? (
                    <ArticleList articles={readArticles.slice(0, 3)} />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">You haven't read any articles yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reading-history">
              <Card>
                <CardHeader>
                  <CardTitle>Reading History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isReadLoading ? (
                    <div className="text-center p-4">Loading articles...</div>
                  ) : readArticles && readArticles.length > 0 ? (
                    <ArticleList articles={readArticles} />
                  ) : (
                    <div className="text-center p-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No reading history yet</h3>
                      <p className="text-muted-foreground">
                        Articles you read will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardHeader>
                  <CardTitle>Saved Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  {isSavedLoading ? (
                    <div className="text-center p-4">Loading saved articles...</div>
                  ) : savedArticles && savedArticles.length > 0 ? (
                    <ArticleList articles={savedArticles} />
                  ) : (
                    <div className="text-center p-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No saved articles yet</h3>
                      <p className="text-muted-foreground">
                        Articles you save will appear here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>My Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  {isAchievementsLoading ? (
                    <div className="text-center p-4">Loading achievements...</div>
                  ) : mappedAchievements.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mappedAchievements.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 flex items-start">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                            <Award className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">{item.achievement?.name}</p>
                            <p className="text-sm text-muted-foreground">{item.achievement?.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned {new Date(item.earnedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No achievements yet</h3>
                      <p className="text-muted-foreground">
                        Complete activities on NewsIQ to earn achievements
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
