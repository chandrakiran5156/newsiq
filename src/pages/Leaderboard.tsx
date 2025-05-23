
import { useQuery } from "@tanstack/react-query";
import { fetchUserLeaderboardPosition, fetchLeaderboard, fetchMonthlyLeaderboard, fetchWeeklyLeaderboard, fetchUserAchievements } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { RefreshCcw, Trophy, BookOpen } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get user's position in the leaderboard
  const { data: userPosition, isLoading: isLoadingPosition, refetch: refetchPosition } = useQuery({
    queryKey: ['user-leaderboard-position', user?.id, refreshTrigger],
    queryFn: () => user ? fetchUserLeaderboardPosition(user.id) : Promise.reject('No user'),
    enabled: !!user,
    staleTime: 30000, // Refresh every 30 seconds
  });

  // Get leaderboard data to check if it's empty
  const { data: leaderboardData, isLoading: isLoadingLeaderboard, refetch: refetchLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'check-exists', refreshTrigger],
    queryFn: () => fetchLeaderboard(1),
    staleTime: 30000, // Refresh every 30 seconds
  });

  // Get top 3 users for podium display
  const { data: topUsers } = useQuery({
    queryKey: ['leaderboard', 'top-3', refreshTrigger],
    queryFn: () => fetchLeaderboard(3),
    staleTime: 30000, // Refresh every 30 seconds
  });
  
  // Fetch user's achievements
  const { data: achievements } = useQuery({
    queryKey: ['user-achievements', user?.id, refreshTrigger],
    queryFn: () => user ? fetchUserAchievements(user.id) : Promise.reject('No user'),
    enabled: !!user,
    staleTime: 30000, // Refresh every 30 seconds
  });

  const hasLeaderboardData = leaderboardData && leaderboardData.length > 0;
  const hasReaderAchievement = achievements?.some(a => a.achievements?.name === 'Avid Reader');

  // Refresh the data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    toast({
      title: "Refreshing leaderboard",
      description: "Fetching the latest leaderboard data...",
    });
    setRefreshTrigger(prev => prev + 1);
    refetchLeaderboard();
    refetchPosition();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            See how you stack up against other learners based on quiz points earned.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          className="flex items-center gap-1"
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* User's achievements */}
      {user && achievements && achievements.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Your Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <Badge key={achievement.id} variant="secondary" className="flex items-center gap-1 py-1.5 px-3">
                  {achievement.achievements?.name === 'Avid Reader' && <BookOpen className="h-4 w-4" />}
                  {achievement.achievements?.name === 'Streak Hunter' && <Trophy className="h-4 w-4" />}
                  {achievement.achievements?.name === 'Quiz Master' && <BookOpen className="h-4 w-4" />}
                  {achievement.achievements?.name}
                </Badge>
              ))}
            </div>
            {achievements.length === 0 && (
              <p className="text-muted-foreground text-sm">Complete more activities to earn achievements!</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* User's position */}
      {user && userPosition && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3">Your Ranking</h2>
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 text-primary p-3 rounded-full">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  You're ranked #{userPosition} on the leaderboard
                </p>
                <p className="text-muted-foreground">
                  Keep taking quizzes to earn points and climb higher!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium - show only if we have data */}
      {topUsers && topUsers.length > 0 && (
        <div className="py-6">
          <h2 className="text-xl font-semibold mb-6 text-center">Top Learners</h2>
          <div className="flex flex-wrap justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            {topUsers.length > 1 && (
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-gray-400">
                  <AvatarImage src={topUsers[1].avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${topUsers[1].username || '2nd'}`} alt={topUsers[1].username} />
                  <AvatarFallback>{topUsers[1].username?.charAt(0) || '2'}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white font-bold -mt-4 mb-2">2</div>
                <div className="text-center">
                  <p className="font-medium">{topUsers[1].username || 'User'}</p>
                  <p className="text-sm font-semibold">{topUsers[1].points} pts</p>
                </div>
                <div className="h-28 w-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2"></div>
              </div>
            )}

            {/* 1st Place */}
            {topUsers.length > 0 && (
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 border-2 border-purple-400">
                  <AvatarImage src={topUsers[0].avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${topUsers[0].username || '1st'}`} alt={topUsers[0].username} />
                  <AvatarFallback>{topUsers[0].username?.charAt(0) || '1'}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-400 text-white font-bold -mt-4 mb-2">1</div>
                <div className="text-center">
                  <p className="font-medium">{topUsers[0].username || 'User'}</p>
                  <p className="text-sm font-semibold">{topUsers[0].points} pts</p>
                </div>
                <div className="h-36 w-16 bg-gradient-to-t from-purple-300 to-purple-200 rounded-t-lg mt-2"></div>
              </div>
            )}

            {/* 3rd Place */}
            {topUsers.length > 2 && (
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-blue-400">
                  <AvatarImage src={topUsers[2].avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${topUsers[2].username || '3rd'}`} alt={topUsers[2].username} />
                  <AvatarFallback>{topUsers[2].username?.charAt(0) || '3'}</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-white font-bold -mt-4 mb-2">3</div>
                <div className="text-center">
                  <p className="font-medium">{topUsers[2].username || 'User'}</p>
                  <p className="text-sm font-semibold">{topUsers[2].points} pts</p>
                </div>
                <div className="h-20 w-16 bg-gradient-to-t from-blue-300 to-blue-200 rounded-t-lg mt-2"></div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* No data alert */}
      {!hasLeaderboardData && !isLoadingLeaderboard && (
        <Alert className="bg-muted/50">
          <AlertTitle>No leaderboard data available</AlertTitle>
          <AlertDescription>
            <p className="mb-4">Complete quizzes to earn points and be the first to appear on the leaderboard!</p>
            <Button onClick={() => navigate('/discover')}>
              Discover Articles with Quizzes
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Leaderboard table */}
      <Card className="border shadow-sm">
        <CardContent className="p-0">
          <LeaderboardTable refreshTrigger={refreshTrigger} />
        </CardContent>
      </Card>
    </div>
  );
}
