
import { Button } from "@/components/ui/button";
import { mockAchievements } from "@/data/mockData";

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    joinedDate: "April 15, 2025",
    avatar: "https://i.pravatar.cc/150?img=32",
    stats: {
      articlesRead: 42,
      quizzesTaken: 18,
      quizAvgScore: 82,
      streak: 5
    },
    achievements: [
      { id: '1', earnedAt: '2025-04-25T14:48:00Z' },
      { id: '2', earnedAt: '2025-04-26T10:12:00Z' },
    ]
  };

  // Find the earned achievements
  const earnedAchievements = mockAchievements.filter(ach => 
    user.achievements.some(earned => earned.id === ach.id)
  );
  
  // Get locked achievements
  const lockedAchievements = mockAchievements.filter(ach => 
    !user.achievements.some(earned => earned.id === ach.id)
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Profile header */}
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">Member since {user.joinedDate}</p>
        </div>
      </div>

      {/* User stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{user.stats.articlesRead}</div>
          <div className="text-sm text-muted-foreground">Articles Read</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{user.stats.quizzesTaken}</div>
          <div className="text-sm text-muted-foreground">Quizzes Taken</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{user.stats.quizAvgScore}%</div>
          <div className="text-sm text-muted-foreground">Quiz Average</div>
        </div>
        <div className="bg-card rounded-lg p-4 shadow-sm">
          <div className="text-3xl font-bold text-primary">{user.stats.streak}</div>
          <div className="text-sm text-muted-foreground">Day Streak</div>
        </div>
      </div>

      {/* Achievements section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        
        {/* Earned achievements */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Earned</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {earnedAchievements.map(achievement => (
            <div key={achievement.id} className="bg-card rounded-lg p-3 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{achievement.iconUrl}</div>
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Locked achievements */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Locked</h3>
        <div className="grid grid-cols-2 gap-3">
          {lockedAchievements.map(achievement => (
            <div key={achievement.id} className="bg-secondary rounded-lg p-3 shadow-sm opacity-70">
              <div className="flex items-center space-x-3">
                <div className="text-4xl">{achievement.iconUrl}</div>
                <div>
                  <div className="font-medium">{achievement.name}</div>
                  <div className="text-xs text-muted-foreground">{achievement.criteria}</div>
                </div>
              </div>
            </div>
          ))}
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
          <Button variant="outline" className="w-full justify-start">
            Topic Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Connected Accounts
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}
