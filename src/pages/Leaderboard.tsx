
import { useQuery } from "@tanstack/react-query";
import { fetchUserLeaderboardPosition } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { ArrowUp } from "lucide-react";

export default function Leaderboard() {
  const { user } = useAuth();

  // Get user's position in the leaderboard
  const { data: userPosition } = useQuery({
    queryKey: ['user-leaderboard-position', user?.id],
    queryFn: () => user ? fetchUserLeaderboardPosition(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other learners in the NewsIQ community.
        </p>
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
                Keep reading and taking quizzes to climb higher!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard table */}
      <LeaderboardTable />
    </div>
  );
}
