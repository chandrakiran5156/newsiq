
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from '@/components/articles/ArticleCard';
import CategoryFilters from '@/components/articles/CategoryFilters';
import { Category, Article } from '@/types';
import { Trophy, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/supabase-auth';
import { 
  fetchArticles, 
  fetchTrendingArticles, 
  fetchArticlesByUserPreference, 
  fetchLeaderboard 
} from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { user } = useAuth();
  
  const handleCategorySelect = useCallback((categoryId: Category | null) => {
    setSelectedCategory(categoryId);
  }, []);

  // Fetch trending articles
  const { data: trendingArticles, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingArticles'],
    queryFn: () => fetchTrendingArticles(3),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch trending articles', error);
      }
    }
  });

  // Fetch personalized articles based on user preferences
  const { data: personalizedArticles, isLoading: isPersonalizedLoading } = useQuery({
    queryKey: ['personalizedArticles', user?.id],
    queryFn: () => user ? fetchArticlesByUserPreference(user.id) : Promise.resolve([]),
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch personalized articles', error);
      }
    }
  });

  // Fetch filtered articles based on selected category
  const { data: filteredArticles, isLoading: isFilteredLoading } = useQuery({
    queryKey: ['articles', selectedCategory],
    queryFn: () => fetchArticles({ category: selectedCategory }),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch filtered articles', error);
      }
    }
  });

  // Fetch leaderboard data
  const { data: leaderboard, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => fetchLeaderboard(3),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch leaderboard', error);
      }
    }
  });

  // Use filtered articles if a category is selected, otherwise use personalized articles
  // NO FALLBACK to mock data anymore - only use database articles
  const displayedArticles = selectedCategory 
    ? (filteredArticles || [])
    : (personalizedArticles || []);

  // Use trending articles from API with no fallback to mock data
  const displayedTrendingArticles = trendingArticles || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Welcome to NewsIQ</h1>
            <p className="text-muted-foreground mb-4">
              Discover personalized news and boost your knowledge with interactive quizzes
            </p>
            <Button asChild>
              <Link to="/discover">Explore Topics</Link>
            </Button>
          </div>
          <div className="bg-card rounded-lg overflow-hidden border border-border shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
              alt="Featured content" 
              className="w-full h-40 object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/discover?category=technology" className="block">
            <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-blue-500/10 to-blue-600/5">
              <CardContent className="p-4">
                <div className="text-blue-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" x2="9" y1="2" y2="4" /><line x1="15" x2="15" y1="2" y2="4" /><line x1="9" x2="9" y1="20" y2="22" /><line x1="15" x2="15" y1="20" y2="22" /><line x1="20" x2="22" y1="9" y2="9" /><line x1="20" x2="22" y1="14" y2="14" /><line x1="2" x2="4" y1="9" y2="9" /><line x1="2" x2="4" y1="14" y2="14" /></svg>
                </div>
                <h3 className="font-semibold">Technology</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/discover?category=business" className="block">
            <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-amber-500/10 to-amber-600/5">
              <CardContent className="p-4">
                <div className="text-amber-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 18v-1"/><path d="M16 18v-3"/></svg>
                </div>
                <h3 className="font-semibold">Business</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/discover?category=science" className="block">
            <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-green-500/10 to-green-600/5">
              <CardContent className="p-4">
                <div className="text-green-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3a2 2 0 0 0-2 2"/><path d="M19 3a2 2 0 0 1 2 2"/><path d="M21 19a2 2 0 0 1-2 2"/><path d="M5 21a2 2 0 0 1-2-2"/><path d="M9 3h1"/><path d="M9 21h1"/><path d="M14 3h1"/><path d="M14 21h1"/><path d="M3 9v1"/><path d="M21 9v1"/><path d="M3 14v1"/><path d="M21 14v1"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>
                </div>
                <h3 className="font-semibold">Science</h3>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/discover?category=health" className="block">
            <Card className="hover:shadow-md transition-shadow bg-gradient-to-br from-red-500/10 to-red-600/5">
              <CardContent className="p-4">
                <div className="text-red-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>
                </div>
                <h3 className="font-semibold">Health</h3>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      
      {/* Trending Articles */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-primary" size={20} />
          <h2 className="text-xl font-bold">Trending Now</h2>
        </div>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {isTrendingLoading ? (
              // Loading skeleton
              Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="w-72 flex-shrink-0">
                  <Card className="h-full">
                    <div className="w-full h-36 bg-muted animate-pulse"></div>
                    <CardHeader className="p-4">
                      <div className="h-4 w-1/4 bg-muted animate-pulse mb-2"></div>
                      <div className="h-5 bg-muted animate-pulse"></div>
                      <div className="h-4 bg-muted animate-pulse mt-2"></div>
                    </CardHeader>
                  </Card>
                </div>
              ))
            ) : displayedTrendingArticles.length > 0 ? (
              displayedTrendingArticles.map((article: Article) => (
                <div key={article.id} className="w-72 flex-shrink-0">
                  <Link to={`/article/${article.id}`} className="block">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <div className="w-full h-36 overflow-hidden">
                        <img 
                          src={article.imageUrl || "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb"} 
                          alt={article.title}
                          className="w-full h-full object-cover" 
                          loading="eager"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
                            {article.difficultyLevel}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} /> {article.readTime} min
                          </span>
                        </div>
                        <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">
                          {article.summary}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              <div className="w-full py-12 text-center">
                <p className="text-muted-foreground">No trending articles found</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Leaderboard Preview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="text-primary" size={20} />
          <h2 className="text-xl font-bold">Top Performers</h2>
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Leaderboard</CardTitle>
            <CardDescription>See who's leading this week</CardDescription>
          </CardHeader>
          <CardContent>
            {isLeaderboardLoading ? (
              // Loading skeleton
              <div className="space-y-3">
                {Array(3).fill(0).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted animate-pulse"></span>
                      <div className="h-4 w-24 bg-muted animate-pulse"></div>
                    </div>
                    <div className="h-4 w-16 bg-muted animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : leaderboard && leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.map((user, idx) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center 
                        ${idx === 0 ? 'bg-yellow-500/20 text-yellow-600' : 
                          idx === 1 ? 'bg-gray-300/30 text-gray-600' : 
                            'bg-amber-600/20 text-amber-700'}`}>
                        {idx + 1}
                      </span>
                      <span>{user.username || `User ${user.id.substring(0, 4)}`}</span>
                    </div>
                    <span className="font-semibold">{user.points || user.weekly_points || 0} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No leaderboard data available</p>
              </div>
            )}
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link to="/achievements">View Full Leaderboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* For You Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">For You</h2>
        <CategoryFilters 
          onSelectCategory={handleCategorySelect} 
          selectedCategory={selectedCategory} 
        />
        {isFilteredLoading || isPersonalizedLoading ? (
          // Loading skeleton grid
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="h-40 bg-muted animate-pulse"></div>
                <div className="p-3">
                  <div className="h-5 bg-muted animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayedArticles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found. Try selecting a different category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
