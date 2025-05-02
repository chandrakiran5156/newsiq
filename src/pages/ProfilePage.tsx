
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase-auth";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile, fetchUserAchievements, getReadArticles } from "@/lib/api";
import { Achievement } from "@/types";
import { Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import UserPreferences from "@/components/profile/UserPreferences";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [achievementsData, setAchievementsData] = useState<{
    earned: Achievement[];
    locked: Achievement[];
  }>({ earned: [], locked: [] });
  
  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => user ? fetchUserProfile(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });

  // Fetch user achievements
  const { data: achievements, isLoading: isLoadingAchievements } = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: () => user ? fetchUserAchievements(user.id) : Promise.reject('No user'),
    enabled: !!user,
    onSuccess: (data) => {
      if (data) {
        // Split into earned and locked achievements
        const earned = data.filter(item => item.earned_at).map(item => item.achievements);
        const locked = data.filter(item => !item.earned_at).map(item => item.achievements);
        setAchievementsData({ earned, locked });
      }
    }
  });

  // Fetch articles read
  const { data: articlesRead, isLoading: isLoadingArticles } = useQuery({
    queryKey: ['articles-read', user?.id],
    queryFn: () => user ? getReadArticles(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoadingProfile || isLoadingAchievements || isLoadingArticles) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Use profile data or fallbacks
  const userStats = {
    articlesRead: articlesRead?.length || 0,
    quizzesTaken: profile?.quizzes_taken || 0,
    quizAvgScore: profile?.avg_quiz_score || 0,
    streak: profile?.current_streak || 0
  };
  
  return (
    <div className="space-y-6 pb-8">
      {/* Profile header */}
      <div className="flex items-center space-x-4">
        <img 
          src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.username || 'User'}`} 
          alt={profile?.username || 'User'} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{profile?.username || 'User'}</h1>
          <p className="text-sm text-muted-foreground">
            Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{userStats.articlesRead}</div>
          <div className="text-sm text-muted-foreground">Articles Read</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{userStats.quizzesTaken}</div>
          <div className="text-sm text-muted-foreground">Quizzes Taken</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{userStats.quizAvgScore}%</div>
          <div className="text-sm text-muted-foreground">Quiz Average</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{userStats.streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
      </div>

      {/* Achievements section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        
        {/* Earned achievements */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Earned</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {achievementsData.earned.length > 0 ? (
            achievementsData.earned.map((achievement) => (
              <div key={achievement.id} className="bg-card rounded-lg p-3 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{achievement.icon_url}</div>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-muted-foreground">
              No achievements earned yet. Keep reading and taking quizzes!
            </div>
          )}
        </div>
        
        {/* Locked achievements */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Locked</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievementsData.locked.length > 0 ? (
            achievementsData.locked.map((achievement) => (
              <div key={achievement.id} className="bg-secondary rounded-lg p-3 shadow-sm opacity-70">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{achievement.icon_url}</div>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground">{achievement.criteria}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-muted-foreground">
              Congratulations! You've unlocked all achievements.
            </div>
          )}
        </div>
      </div>
      
      {/* Settings section */}
      <div className="mt-8 pt-6 border-t border-border">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Notification Settings
          </Button>
          <UserPreferences />
          <Button variant="outline" className="w-full justify-start">
            Connected Accounts
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
