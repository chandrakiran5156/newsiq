
import { Article } from '@/types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase-auth';
import { supabase } from '@/integrations/supabase/client';

interface ArticleListProps {
  articles: Article[];
  isLoading?: boolean;
}

export default function ArticleList({ articles, isLoading = false }: ArticleListProps) {
  const { user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="border rounded-lg overflow-hidden animate-pulse h-24">
            <div className="flex h-full">
              <div className="w-24 bg-muted"></div>
              <div className="flex-1 p-3">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Log articles for debugging
  console.log("ArticleList rendering with:", articles?.length, "articles");
  
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <p className="text-muted-foreground">No articles found</p>
        <p className="text-sm text-muted-foreground mt-2">Try refreshing the page or check back later</p>
      </div>
    );
  }
  
  // Get category icon based on category name
  const getCategoryIcon = (category: string) => {
    const categoryIcons: Record<string, string> = {
      'technology': '💻',
      'science': '🔬',
      'politics': '🏛️',
      'business': '💼',
      'finance': '💰',
      'health': '🏥',
      'sports': '⚽',
      'entertainment': '🎬',
      'education': '📚'
    };
    
    return categoryIcons[category.toLowerCase()] || '📄';
  };
  
  return (
    <div className="space-y-4">
      {articles.map(article => {
        // Use a unique query for each article
        const { data: readingTimeData } = useQuery({
          queryKey: ['articleReadingTime', article.id, user?.id],
          queryFn: async () => {
            if (!user) return { read_time: 0 };
            
            const { data, error } = await supabase
              .from('user_article_interactions')
              .select('read_time')
              .eq('article_id', article.id)
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching reading time:', error);
              return { read_time: 0 };
            }
            
            return { read_time: data?.read_time || 0 };
          },
          enabled: !!user,
        });
        
        // Get the reading time value from the query result
        const readingTime = readingTimeData?.read_time || 0;
        
        // Format reading time display
        const getReadingTimeDisplay = () => {
          if (readingTime === 0) {
            return 'New';
          } else {
            const roundedMinutes = Math.ceil(readingTime / 60); // Convert seconds to minutes and round up
            return `${roundedMinutes} min`;
          }
        };
        
        return (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`} 
            className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex h-24">
              <div className="w-24 flex-shrink-0">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-2 text-sm">{article.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-2">{getCategoryIcon(article.category)}</span>
                    <Clock size={12} className="mr-1" />
                    {readingTime === 0 ? (
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">New</span>
                    ) : (
                      <span>{getReadingTimeDisplay()}</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
