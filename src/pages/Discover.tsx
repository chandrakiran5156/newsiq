import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Filter } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article, Category } from '@/types';
import { fetchArticles, fetchTrendingArticles, fetchArticlesByUserPreference } from '@/lib/api';
import { useAuth } from '@/lib/supabase-auth';
import { useSearchParams } from 'react-router-dom';
import { mockArticles } from '@/data/mockData'; // Fallback

// Define categories with their icons
const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'business', name: 'Business', icon: '📊' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '📚' },
];

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get category from URL if present
  useEffect(() => {
    const categoryFromURL = searchParams.get('category') as Category | null;
    if (categoryFromURL) {
      // If there's a category in the URL, you might want to set initial filter state
      // or perform a search based on this category
    }
  }, [searchParams]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch all articles with search filter
  const { data: allArticles, isLoading: isAllLoading } = useQuery({
    queryKey: ['articles', 'all', debouncedSearchTerm],
    queryFn: () => fetchArticles({ search: debouncedSearchTerm }),
    meta: {
      onError: () => {
        console.error('Failed to fetch articles, using mock data');
      }
    }
  });
  
  // Fetch trending articles
  const { data: trendingArticles, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['articles', 'trending'],
    queryFn: () => fetchTrendingArticles(12),
    meta: {
      onError: () => {
        console.error('Failed to fetch trending articles, using mock data');
      }
    }
  });
  
  // Fetch personalized articles
  const { data: recommendedArticles, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ['articles', 'recommended', user?.id],
    queryFn: () => user ? fetchArticlesByUserPreference(user.id, 12) : Promise.resolve([]),
    enabled: !!user,
    meta: {
      onError: () => {
        console.error('Failed to fetch recommended articles, using mock data');
      }
    }
  });

  // Filter mock articles based on search term (fallback)
  const filteredMockArticles = searchTerm 
    ? mockArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockArticles;
    
  // Get articles based on selected tab and search results
  const getDisplayArticles = () => {
    switch(selectedTab) {
      case 'trending':
        return trendingArticles || filteredMockArticles.slice(0, 6);
      case 'recommended':
        return recommendedArticles || filteredMockArticles.slice(3, 9);
      default:
        return allArticles || filteredMockArticles;
    }
  };

  const displayArticles = getDisplayArticles();
  
  // Get loading state based on selected tab
  const isLoading = selectedTab === 'trending' 
    ? isTrendingLoading 
    : selectedTab === 'recommended' 
    ? isRecommendedLoading 
    : isAllLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Discover</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles, topics, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        {/* Topics Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Topics
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button 
                key={category.id} 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
                onClick={() => {
                  setSearchParams({ category: category.id });
                  setSelectedTab('all');
                }}
              >
                <span className="mr-2">{category.icon}</span> {category.name}
              </Button>
            ))}
            <Button 
              variant="outline" 
              className="h-auto py-3 justify-start text-left bg-primary/5 border-primary/20"
              onClick={() => {
                setSearchParams({});
                setSelectedTab('all');
              }}
            >
              View All
            </Button>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="all" value={selectedTab} className="w-full" onValueChange={setSelectedTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="recommended">For You</TabsTrigger>
            </TabsList>
            
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
          </div>
          
          {['all', 'trending', 'recommended'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue} className="mt-0">
              {isLoading ? (
                // Loading skeleton grid
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              ) : displayArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayArticles.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
