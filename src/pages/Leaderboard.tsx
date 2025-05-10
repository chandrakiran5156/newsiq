
import { useQuery } from "@tanstack/react-query";
import { fetchUserLeaderboardPosition, fetchLeaderboard, fetchMonthlyLeaderboard, fetchWeeklyLeaderboard } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { ArrowUp, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const hasLeaderboardData = leaderboardData && leaderboardData.length > 0;

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
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
      <LeaderboardTable refreshTrigger={refreshTrigger} />
    </div>
  );
}
