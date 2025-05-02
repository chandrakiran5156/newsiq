
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import { Article, Category, DifficultyLevel } from '@/types';
import { fetchArticles, fetchArticlesByUserPreference } from '@/lib/api';
import { useAuth } from '@/lib/supabase-auth';
import { useSearchParams } from 'react-router-dom';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Define categories with their icons
const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'business', name: 'Business', icon: '📊' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '📚' },
];

const difficultyLevels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced'];

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const ITEMS_PER_PAGE = 12;
  
  // Get category from URL if present
  useEffect(() => {
    const categoryFromURL = searchParams.get('category') as Category | null;
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [searchParams]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedDifficulty, sortBy]);
  
  // Fetch all articles with search filter and pagination
  const { data: allArticles = [], isLoading: isAllLoading, isFetching: isAllFetching } = useQuery({
    queryKey: ['articles', 'all', debouncedSearchTerm, page, sortBy, selectedCategory, selectedDifficulty],
    queryFn: () => fetchArticles({ 
      search: debouncedSearchTerm, 
      category: selectedCategory,
      difficultyLevel: selectedDifficulty,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      sortBy,
    }),
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch articles:', error);
      }
    }
  });
  
  // Fetch personalized articles
  const { data: recommendedArticles = [], isLoading: isRecommendedLoading } = useQuery({
    queryKey: ['articles', 'recommended', user?.id],
    queryFn: () => user ? fetchArticlesByUserPreference(user.id, 12) : Promise.resolve([]),
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch recommended articles:', error);
      }
    }
  });
    
  // Get articles based on selected tab and search results
  const getDisplayArticles = (): Article[] => {
    switch(selectedTab) {
      case 'recommended':
        return recommendedArticles;
      default:
        return allArticles;
    }
  };

  const displayArticles = getDisplayArticles();
  
  // Get loading state based on selected tab
  const isLoading = selectedTab === 'recommended' ? isRecommendedLoading : isAllLoading;
  const isFetching = selectedTab === 'all' && isAllFetching;

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Handle category filter
  const handleCategoryChange = (categoryId: Category | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  // Handle difficulty filter
  const handleDifficultyChange = (difficulty: DifficultyLevel | null) => {
    setSelectedDifficulty(difficulty);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSortBy('newest');
    setSearchParams({});
  };

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on new search
            }}
            className="pl-10 pr-4"
          />
        </div>
        
        {/* Topics Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Categories
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((category) => (
              <Button 
                key={category.id} 
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="h-auto py-3 justify-start text-left"
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="mr-2">{category.icon}</span> {category.name}
              </Button>
            ))}
            <Button 
              variant={!selectedCategory ? "default" : "outline"} 
              className="h-auto py-3 justify-start text-left"
              onClick={() => handleCategoryChange(null)}
            >
              View All
            </Button>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="all" value={selectedTab} className="w-full" onValueChange={(value) => {
          setSelectedTab(value);
          setPage(1); // Reset page on tab change
        }}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="recommended">For You</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" /> Newest first
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4" /> Oldest first
                    </div>
                  </SelectItem>
                  <SelectItem value="most-read">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" /> Most read
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h3 className="font-medium">Filters</h3>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Difficulty</h4>
                      <div className="flex flex-wrap gap-2">
                        {difficultyLevels.map((level) => (
                          <Button
                            key={level}
                            size="sm"
                            variant={selectedDifficulty === level ? "default" : "outline"}
                            onClick={() => handleDifficultyChange(selectedDifficulty === level ? null : level)}
                            className="text-xs"
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="ghost" onClick={clearFilters} className="w-full">Clear filters</Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {['all', 'recommended'].map(tabValue => (
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayArticles.map((article: Article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  
                  {/* Only show pagination for 'all' tab */}
                  {selectedTab === 'all' && (
                    <div className="flex justify-center mt-8">
                      <Button
                        variant="outline"
                        className="mx-1"
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        className="mx-1"
                        disabled={displayArticles.length < ITEMS_PER_PAGE || isFetching}
                        onClick={() => setPage(p => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
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
