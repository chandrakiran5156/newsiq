
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { mockArticles } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Clock, BookmarkCheck, History, Bookmark } from 'lucide-react';

export default function Library() {
  const [activeTab, setActiveTab] = useState('saved');
  
  // Sample data for demonstration
  const savedArticles = mockArticles.slice(0, 3);
  const readArticles = mockArticles.slice(3, 7);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Library</h1>
        <Button variant="ghost" size="sm">
          <History size={16} className="mr-2" /> Sync History
        </Button>
      </div>
      
      <Tabs defaultValue="saved" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkCheck size={16} /> Saved Articles
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={16} /> Reading History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="saved" className="mt-4">
          {savedArticles.length > 0 ? (
            <div className="space-y-4">
              {savedArticles.map(article => (
                <Card key={article.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/4 h-36 md:h-full">
                      <img 
                        src={article.imageUrl || 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb'} 
                        alt={article.title}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <span className={`difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
                          {article.difficultyLevel}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Bookmark className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <h3 className="font-semibold mt-2 mb-1">{article.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {article.summary}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock size={12} className="mr-1" /> {article.readTime} min read
                        </span>
                        <Button asChild size="sm">
                          <Link to={`/article/${article.id}`}>Continue Reading</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookmarkCheck size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No saved articles yet</h3>
              <p className="text-muted-foreground mb-4">
                Bookmark articles to read them later
              </p>
              <Button asChild>
                <Link to="/discover">Discover Articles</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          {readArticles.length > 0 ? (
            <div className="space-y-4">
              {readArticles.map(article => (
                <Card key={article.id}>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{article.title}</CardTitle>
                        <CardDescription className="text-xs">
                          Read on {new Date().toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock size={12} className="mr-1" /> {article.readTime} min
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-3 px-4">
                    <div className="flex justify-between items-center">
                      <span className={`difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
                        {article.difficultyLevel}
                      </span>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/article/${article.id}`}>Read Again</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No reading history</h3>
              <p className="text-muted-foreground mb-4">
                Articles you read will appear here
              </p>
              <Button asChild>
                <Link to="/discover">Start Reading</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
