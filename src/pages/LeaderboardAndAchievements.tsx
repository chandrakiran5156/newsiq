
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAchievements, fetchAllAchievements, fetchUserLeaderboardPosition, updateAchievementsForExistingUsers } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowUp, Trophy, Medal, Award, Book, Check, Star, Clock } from "lucide-react";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LeaderboardAndAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"leaderboard" | "achievements">("leaderboard");
  const [achievementProgress, setAchievementProgress] = useState({
    earned: 0,
    total: 0,
    percentage: 0
  });
  const [isUpdatingAchievements, setIsUpdatingAchievements] = useState(false);

  // Fetch all achievements
  const { data: allAchievements, isLoading: isLoadingAll, error: allError } = useQuery({
    queryKey: ['achievements-all'],
    queryFn: fetchAllAchievements,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch all achievements:', error);
      }
    }
  });

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingUser, error: userError, refetch: refetchUserAchievements } = useQuery({
    queryKey: ['achievements-user', user?.id],
    queryFn: () => user ? fetchUserAchievements(user.id) : Promise.reject('No user'),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch user achievements:', error);
      }
    }
  });

  // Get user's position in the leaderboard
  const { data: userPosition } = useQuery({
    queryKey: ['user-leaderboard-position', user?.id],
    queryFn: () => user ? fetchUserLeaderboardPosition(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });

  // Calculate achievement progress
  useEffect(() => {
    if (allAchievements && userAchievements) {
      const earnedCount = userAchievements.filter(a => a.earned_at).length;
      const totalCount = allAchievements.length;
      const percentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
      
      setAchievementProgress({
        earned: earnedCount,
        total: totalCount,
        percentage
      });
    }
  }, [allAchievements, userAchievements]);

  // Update achievements for existing users
  const handleUpdateAchievements = async () => {
    if (!user?.id) return;
    
    setIsUpdatingAchievements(true);
    try {
      const result = await updateAchievementsForExistingUsers();
      if (result.error) {
        toast({
          title: "Error updating achievements",
          description: String(result.error),
          variant: "destructive"
        });
      } else {
        toast({
          title: "Achievements Updated",
          description: `Updated achievements for ${result.updated} users`,
          variant: "success"
        });
        // Refetch user achievements
        refetchUserAchievements();
      }
    } catch (error) {
      toast({
        title: "Error updating achievements",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setIsUpdatingAchievements(false);
    }
  };

  // Get icon based on achievement name
  const getAchievementIcon = (name: string) => {
    switch (name) {
      case "Avid Reader":
        return <Book className="h-5 w-5" />;
      case "Quiz Master":
        return <Trophy className="h-5 w-5" />;
      case "Quiz Enthusiast":
        return <Medal className="h-5 w-5" />;
      case "Article Collector":
        return <Star className="h-5 w-5" />;
      case "Streak Hunter":
        return <Clock className="h-5 w-5" />;
      case "Point Collector":
      case "Point Master":
        return <Award className="h-5 w-5" />;
      default:
        return <Check className="h-5 w-5" />;
    }
  };

  // Process achievements to separate earned and locked
  const processedAchievements = allAchievements?.map(achievement => {
    const userAchievement = userAchievements?.find(ua => 
      ua.achievement_id === achievement.id
    );
    
    return {
      ...achievement,
      earned: !!userAchievement?.earned_at,
      earnedAt: userAchievement?.earned_at
    };
  }) || [];

  const earnedAchievements = processedAchievements.filter(a => a.earned);
  const lockedAchievements = processedAchievements.filter(a => !a.earned);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Achievements & Leaderboard</h1>
          <p className="text-muted-foreground">
            Track your progress and see how you compare with other learners.
          </p>
        </div>
        {user?.id && (
          <Button 
            variant="outline" 
            onClick={handleUpdateAchievements} 
            disabled={isUpdatingAchievements}
          >
            {isUpdatingAchievements && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Achievements
          </Button>
        )}
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-6">
        {/* Main Content */}
        <div className="md:w-2/3">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "leaderboard" | "achievements")} className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="leaderboard" className="space-y-6">
              <LeaderboardTable />
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              {/* Achievement Progress */}
              {user && allAchievements && userAchievements && (
                <div className="bg-card p-4 rounded-lg border shadow-sm mb-6">
                  <h2 className="text-lg font-semibold mb-2">Achievement Progress</h2>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{achievementProgress.earned} of {achievementProgress.total} achievements earned</span>
                    <span>{achievementProgress.percentage}%</span>
                  </div>
                  <Progress value={achievementProgress.percentage} className="h-2" />
                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground">
                      Keep reading articles and completing quizzes to earn more achievements!
                    </p>
                  </div>
                </div>
              )}
            
              {isLoadingAll || isLoadingUser ? (
                <div className="flex justify-center items-center h-[60vh]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : allError || userError || !allAchievements ? (
                <div className="bg-destructive/10 p-6 rounded-lg text-center">
                  <p className="text-destructive font-medium mb-2">
                    Could not load achievements
                  </p>
                  <p className="text-sm">
                    There was an error loading achievement data. Please try again later.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Earned achievements */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Earned Achievements</h2>
                    {earnedAchievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {earnedAchievements.map(achievement => (
                          <div 
                            key={achievement.id} 
                            className="bg-card border rounded-lg p-4 shadow-sm flex items-start gap-4"
                          >
                            <div className="bg-primary/10 rounded-full p-3 text-primary flex-shrink-0">
                              {getAchievementIcon(achievement.name)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{achievement.name}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              <p className="text-xs mt-2 text-muted-foreground">
                                Earned on {new Date(achievement.earnedAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-muted/50 rounded-lg">
                        <p className="text-muted-foreground">You haven't earned any achievements yet.</p>
                        <p className="text-sm">Read articles and complete quizzes to earn your first achievement!</p>
                      </div>
                    )}
                  </div>

                  {/* Locked achievements */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Achievements to Unlock</h2>
                    {lockedAchievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lockedAchievements.map(achievement => (
                          <div 
                            key={achievement.id} 
                            className="bg-secondary/30 border rounded-lg p-4 shadow-sm flex items-start gap-4 opacity-70"
                          >
                            <div className="bg-muted rounded-full p-3 text-muted-foreground flex-shrink-0">
                              {getAchievementIcon(achievement.name)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{achievement.name}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.criteria}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-success/10 rounded-lg">
                        <p className="font-medium text-success-foreground">
                          Congratulations! You've unlocked all achievements.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/3 space-y-4">
          {/* User's position */}
          {user && userPosition && (
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Your Ranking</h2>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <ArrowUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">
                    You're ranked #{userPosition} on the leaderboard
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep taking quizzes to earn points and climb higher!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          {earnedAchievements && earnedAchievements.length > 0 && (
            <div className="bg-card p-4 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Recent Achievements</h2>
              <div className="space-y-3">
                {earnedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      {getAchievementIcon(achievement.name)}
                    </div>
                    <div>
                      <p className="font-medium">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Earned on {new Date(achievement.earnedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievement Categories */}
          <div className="bg-card p-4 rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Achievement Categories</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <Book className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Reading</p>
                  <p className="text-xs text-muted-foreground">Complete reading articles</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <Trophy className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quiz Performance</p>
                  <p className="text-xs text-muted-foreground">Get perfect scores on quizzes</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Streaks</p>
                  <p className="text-xs text-muted-foreground">Read articles consistently</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-sm">Points</p>
                  <p className="text-xs text-muted-foreground">Earn points from activities</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
