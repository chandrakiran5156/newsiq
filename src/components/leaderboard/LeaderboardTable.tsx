
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard, fetchWeeklyLeaderboard, fetchMonthlyLeaderboard } from "@/lib/api";
import { Loader2, Trophy, Medal } from "lucide-react";
import { useAuth } from "@/lib/supabase-auth";
import { useToast } from "@/hooks/use-toast";

export default function LeaderboardTable() {
  const [period, setPeriod] = useState<"all-time" | "weekly" | "monthly">("all-time");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all-time leaderboard
  const { data: allTimeLeaderboard, isLoading: isLoadingAllTime, refetch: refetchAllTime } = useQuery({
    queryKey: ['leaderboard', 'all-time'],
    queryFn: () => fetchLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: () => {
        toast({
          title: "Error loading leaderboard",
          description: "Failed to load leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Fetch weekly leaderboard
  const { data: weeklyLeaderboard, isLoading: isLoadingWeekly, refetch: refetchWeekly } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: () => fetchWeeklyLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: () => {
        toast({
          title: "Error loading weekly leaderboard",
          description: "Failed to load weekly leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Fetch monthly leaderboard
  const { data: monthlyLeaderboard, isLoading: isLoadingMonthly, refetch: refetchMonthly } = useQuery({
    queryKey: ['leaderboard', 'monthly'],
    queryFn: () => fetchMonthlyLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: () => {
        toast({
          title: "Error loading monthly leaderboard",
          description: "Failed to load monthly leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  const getLeaderboardData = () => {
    switch(period) {
      case "all-time":
        return { data: allTimeLeaderboard, isLoading: isLoadingAllTime, refetch: refetchAllTime };
      case "weekly":
        return { data: weeklyLeaderboard, isLoading: isLoadingWeekly, refetch: refetchWeekly };
      case "monthly":
        return { data: monthlyLeaderboard, isLoading: isLoadingMonthly, refetch: refetchMonthly };
      default:
        return { data: allTimeLeaderboard, isLoading: isLoadingAllTime, refetch: refetchAllTime };
    }
  };
  
  const { data: leaderboardData, isLoading } = getLeaderboardData();
  
  const getRankStyles = (rank: number) => {
    switch(rank) {
      case 1:
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      case 2:
        return "bg-gray-100 dark:bg-gray-700/40 text-gray-800 dark:text-gray-300";
      case 3:
        return "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300";
      default:
        return "";
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-500" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-medium">{rank}</span>;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all-time" onValueChange={(value) => setPeriod(value as "all-time" | "weekly" | "monthly")}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="all-time">All Time</TabsTrigger>
          <TabsTrigger value="weekly">This Week</TabsTrigger>
          <TabsTrigger value="monthly">This Month</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-time">
          {renderLeaderboardTable(isLoadingAllTime, allTimeLeaderboard, getRankStyles, getRankIcon, user?.id)}
        </TabsContent>
        
        <TabsContent value="weekly">
          {renderLeaderboardTable(isLoadingWeekly, weeklyLeaderboard, getRankStyles, getRankIcon, user?.id)}
        </TabsContent>

        <TabsContent value="monthly">
          {renderLeaderboardTable(isLoadingMonthly, monthlyLeaderboard, getRankStyles, getRankIcon, user?.id)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderLeaderboardTable(
  isLoading: boolean, 
  data: any[] | undefined, 
  getRankStyles: (rank: number) => string,
  getRankIcon: (rank: number) => React.ReactNode,
  currentUserId?: string
) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-2">No leaderboard data available yet.</p>
        <p className="text-sm">Complete quizzes to earn points and appear on the leaderboard!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Quizzes</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Avg Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={`${entry.id === currentUserId ? 'bg-primary/5' : ''} ${getRankStyles(index + 1)}`}
            >
              <TableCell className="font-medium">
                <div className="flex justify-center items-center">
                  {getRankIcon(index + 1)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img
                    src={entry.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username || 'User'}`}
                    alt={entry.username || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{entry.username || 'Anonymous User'}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {entry.points || 0}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {entry.quizzes_taken || 0}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {entry.avg_quiz_score ? `${Math.round(entry.avg_quiz_score)}%` : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
