
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserAchievements, fetchAllAchievements } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Achievements() {
  const { user } = useAuth();
  const [achievementProgress, setAchievementProgress] = useState({
    earned: 0,
    total: 0,
    percentage: 0
  });

  // Fetch all achievements
  const { data: allAchievements, isLoading: isLoadingAll } = useQuery({
    queryKey: ['achievements-all'],
    queryFn: fetchAllAchievements
  });

  // Fetch user achievements
  const { data: userAchievements, isLoading: isLoadingUser } = useQuery({
    queryKey: ['achievements-user', user?.id],
    queryFn: () => user ? fetchUserAchievements(user.id) : Promise.reject('No user'),
    enabled: !!user
  });

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

  if (isLoadingAll || isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and earn recognition for your learning journey.
        </p>
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
                <div className="text-4xl flex-shrink-0">{achievement.icon_url}</div>
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
                <div className="text-4xl flex-shrink-0">{achievement.icon_url}</div>
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
