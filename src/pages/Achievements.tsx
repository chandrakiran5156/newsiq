
import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserAchievements, fetchAllAchievements, updateAchievementsForExistingUsers } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import { Loader2, Book, Trophy, Medal, Award, Clock, Star, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Achievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [achievementProgress, setAchievementProgress] = useState({
    earned: 0,
    total: 0,
    percentage: 0
  });

  // Fetch all achievements with better error handling
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

  // Fetch user achievements with better error handling
  const { data: userAchievements, isLoading: isLoadingUser, error: userError, refetch: refetchAchievements } = useQuery({
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
  
  // Update achievements mutation
  const { mutate: updateAchievements, isPending: isUpdating } = useMutation({
    mutationFn: updateAchievementsForExistingUsers,
    onSuccess: (data) => {
      toast({
        title: "Achievements Updated",
        description: `Updated achievements for ${data.updated} users`,
        variant: "success"
      });
      refetchAchievements();
    },
    onError: (error) => {
      toast({
        title: "Error updating achievements",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  // Log for debugging
  useEffect(() => {
    if (allError) console.error('All achievements error:', allError);
    if (userError) console.error('User achievements error:', userError);
    
    console.log('All achievements data:', allAchievements);
    console.log('User achievements data:', userAchievements);
  }, [allAchievements, userAchievements, allError, userError]);

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

  if (isLoadingAll || isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle error cases
  if (allError || userError || !allAchievements) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and earn recognition for your learning journey.
          </p>
        </div>
        
        <div className="bg-destructive/10 p-6 rounded-lg text-center">
          <p className="text-destructive font-medium mb-2">
            Could not load achievements
          </p>
          <p className="text-sm">
            There was an error loading achievement data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">
            Track your progress and earn recognition for your learning journey.
          </p>
        </div>
        
        {user && (
          <Button 
            variant="outline" 
            onClick={() => updateAchievements()} 
            disabled={isUpdating}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Achievements
          </Button>
        )}
      </div>

      {/* Progress overview */}
      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Your Progress</h2>
        <div className="flex justify-between text-sm mb-1">
          <span>{achievementProgress.earned} of {achievementProgress.total} achievements earned</span>
          <span>{achievementProgress.percentage}%</span>
        </div>
        <Progress value={achievementProgress.percentage} className="h-2" />
      </div>
      
      {/* Achievement Categories */}
      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Achievement Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <Book className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Reading</p>
              <p className="text-xs text-muted-foreground">Complete reading articles</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Quiz Performance</p>
              <p className="text-xs text-muted-foreground">Get perfect scores on quizzes</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Streaks</p>
              <p className="text-xs text-muted-foreground">Read articles consistently</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Points</p>
              <p className="text-xs text-muted-foreground">Earn points from activities</p>
            </div>
          </div>
        </div>
      </div>

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
  );
}
