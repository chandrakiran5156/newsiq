
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LeaderboardTableProps {
  refreshTrigger?: number;
}

export default function LeaderboardTable({ refreshTrigger = 0 }: LeaderboardTableProps) {
  const [period, setPeriod] = useState<"all-time" | "weekly" | "monthly">("all-time");
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all-time leaderboard
  const { data: allTimeLeaderboard, isLoading: isLoadingAllTime } = useQuery({
    queryKey: ['leaderboard', 'all-time', refreshTrigger],
    queryFn: () => fetchLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error loading leaderboard",
          description: "Failed to load leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Fetch weekly leaderboard
  const { data: weeklyLeaderboard, isLoading: isLoadingWeekly } = useQuery({
    queryKey: ['leaderboard', 'weekly', refreshTrigger],
    queryFn: () => fetchWeeklyLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: (error: any) => {
        toast({
          title: "Error loading weekly leaderboard",
          description: "Failed to load weekly leaderboard data. Please try again.",
          variant: "destructive",
        });
      }
    }
  });
  
  // Fetch monthly leaderboard
  const { data: monthlyLeaderboard, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['leaderboard', 'monthly', refreshTrigger],
    queryFn: () => fetchMonthlyLeaderboard(20),
    staleTime: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: true,
    meta: {
      onError: (error: any) => {
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
        return { data: allTimeLeaderboard, isLoading: isLoadingAllTime };
      case "weekly":
        return { data: weeklyLeaderboard, isLoading: isLoadingWeekly };
      case "monthly":
        return { data: monthlyLeaderboard, isLoading: isLoadingMonthly };
      default:
        return { data: allTimeLeaderboard, isLoading: isLoadingAllTime };
    }
  };
  
  const getRankStyles = (rank: number) => {
    switch(rank) {
      case 1:
        return "bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300";
      case 2:
        return "bg-gray-100 dark:bg-gray-700/40 text-gray-800 dark:text-gray-300";
      case 3:
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300";
      default:
        return "";
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-purple-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-500" />;
      case 3:
        return <Medal className="h-5 w-5 text-blue-600" />;
      default:
        return <span className="font-medium">{rank}</span>;
    }
  };

  return (
    <div>
      <Tabs defaultValue="all-time" onValueChange={(value) => setPeriod(value as "all-time" | "weekly" | "monthly")} className="w-full">
        <TabsList className="grid grid-cols-3 w-full rounded-t-md bg-muted/70">
          <TabsTrigger value="all-time" className="font-medium">All Time</TabsTrigger>
          <TabsTrigger value="weekly" className="font-medium">This Week</TabsTrigger>
          <TabsTrigger value="monthly" className="font-medium">This Month</TabsTrigger>
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
  
  // Filter out users with zero points and sort properly
  const filteredData = data
    .filter(entry => entry.points > 0 || entry.quizzes_taken > 0)
    .sort((a, b) => {
      // Primary sort by points
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      
      // Secondary sort by quizzes taken
      if (b.quizzes_taken !== a.quizzes_taken) {
        return b.quizzes_taken - a.quizzes_taken;
      }
      
      // Tertiary sort by average score
      return (b.avg_quiz_score || 0) - (a.avg_quiz_score || 0);
    });

  return (
    <div>
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead className="text-right">Points</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Quizzes</TableHead>
            <TableHead className="hidden md:table-cell text-right">Avg Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={`${entry.id === currentUserId ? 'bg-primary/5' : ''} ${getRankStyles(index + 1)} transition-colors`}
            >
              <TableCell className="font-medium text-center">
                <div className="flex justify-center items-center">
                  {index < 3 ? (
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full
                      ${index === 0 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 
                        index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-300' : 
                          'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {getRankIcon(index + 1)}
                    </div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={entry.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${entry.username || 'User'}`}
                      alt={entry.username || 'User'}
                    />
                    <AvatarFallback>{entry.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{entry.username || 'Anonymous User'}</div>
                    {entry.id === currentUserId && (
                      <span className="text-xs text-primary font-medium">You</span>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {entry.points || 0}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {entry.quizzes_taken || 0}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right">
                {entry.avg_quiz_score ? `${Math.round(entry.avg_quiz_score)}%` : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
