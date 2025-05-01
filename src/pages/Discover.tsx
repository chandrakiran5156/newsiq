
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockArticles } from '@/data/mockData';
import { Search, TrendingUp, Clock, Filter } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter articles based on search term (simulated)
  const filteredArticles = searchTerm 
    ? mockArticles.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockArticles;
    
  // Get trending topics based on mockArticles
  const topics = Array.from(new Set(mockArticles.map(article => article.category)));
  
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
            {topics.map((topic, idx) => (
              <Button 
                key={idx} 
                variant="outline" 
                className="h-auto py-3 justify-start text-left"
              >
                {topic}
              </Button>
            ))}
            <Button 
              variant="outline" 
              className="h-auto py-3 justify-start text-left bg-primary/5 border-primary/20"
            >
              View All
            </Button>
          </div>
        </div>
        
        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
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
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.slice(0, 6).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.slice(3, 9).map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
