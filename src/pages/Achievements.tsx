
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Medal, Star, Clock, BookOpen, Target, Zap, TrendingUp } from 'lucide-react';

export default function Achievements() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  
  const leaderboardUsers = [
    { name: "Alex Johnson", score: 2840, progress: 92, rank: 1 },
    { name: "Taylor Smith", score: 2620, progress: 86, rank: 2 },
    { name: "Jordan Lee", score: 2420, progress: 80, rank: 3 },
    { name: "Sam Rodriguez", score: 2210, progress: 74, rank: 4 },
    { name: "Casey Martin", score: 2050, progress: 69, rank: 5 },
    { name: "Riley Chen", score: 1940, progress: 65, rank: 6 },
    { name: "Jesse Williams", score: 1820, progress: 61, rank: 7 },
    { name: "You", score: 1750, progress: 58, rank: 8, highlight: true },
    { name: "Morgan Taylor", score: 1620, progress: 54, rank: 9 },
    { name: "Drew Parker", score: 1520, progress: 51, rank: 10 }
  ];
  
  const achievements = [
    { 
      name: "Reading Streak", 
      description: "Read articles for 7 consecutive days", 
      progress: 5, 
      total: 7, 
      icon: Zap,
      earned: false 
    },
    { 
      name: "Knowledge Master", 
      description: "Score 100% on 5 quizzes", 
      progress: 3, 
      total: 5, 
      icon: Award,
      earned: false 
    },
    { 
      name: "Tech Expert", 
      description: "Read 10 technology articles", 
      progress: 10, 
      total: 10, 
      icon: Star,
      earned: true 
    },
    { 
      name: "Quick Learner", 
      description: "Complete 20 quizzes", 
      progress: 18, 
      total: 20, 
      icon: Target,
      earned: false 
    },
    { 
      name: "Bookworm", 
      description: "Read for a total of 2 hours", 
      progress: 90, 
      total: 120, 
      icon: Clock,
      earned: false,
      unit: "min" 
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Achievements & Leaderboards</h1>
      </div>
      
      <Tabs defaultValue="leaderboard" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy size={16} /> Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Medal size={16} /> My Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="leaderboard" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Global Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardUsers.map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center gap-4 p-3 rounded-md ${
                      user.highlight ? 'bg-primary/10 border border-primary/20' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${user.rank === 1 ? 'bg-yellow-500/20 text-yellow-600' : 
                        user.rank === 2 ? 'bg-slate-300/30 text-slate-600' : 
                          user.rank === 3 ? 'bg-amber-600/20 text-amber-700' : 
                            'bg-accent text-muted-foreground'}`}
                    >
                      {user.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-medium ${user.highlight ? 'text-primary' : ''}`}>
                          {user.name}
                        </span>
                        <span className="text-sm font-semibold">
                          {user.score} pts
                        </span>
                      </div>
                      <Progress value={user.progress} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-primary/10 to-accent border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Reading Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Articles Read</p>
                      <p className="text-2xl font-bold">42</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Reading Time</p>
                      <p className="text-2xl font-bold">3.5h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-accent to-accent/5 border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Quiz Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Quizzes Taken</p>
                      <p className="text-2xl font-bold">18</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Avg. Score</p>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">My Achievements</h3>
              
              {achievements.map((achievement, idx) => (
                <Card key={idx} className={`overflow-hidden ${
                  achievement.earned ? 'border-primary/30' : ''
                }`}>
                  <div className="flex items-center p-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                      achievement.earned 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-accent text-muted-foreground'
                    }`}>
                      <achievement.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.earned && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                            Earned
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress 
                          value={(achievement.progress / achievement.total) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="text-xs font-medium whitespace-nowrap">
                          {achievement.progress}/{achievement.total} 
                          {achievement.unit ? ` ${achievement.unit}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
