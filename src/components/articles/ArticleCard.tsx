
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { BookmarkPlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase-auth';
import { supabase } from '@/integrations/supabase/client';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { user } = useAuth();
  
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
  
  // Get user's reading time for this article
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
  
  // Format the reading time display
  const getReadingTimeDisplay = () => {
    if (readingTime === 0) {
      return 'New';
    } else {
      const roundedMinutes = Math.ceil(readingTime / 60); // Convert seconds to minutes and round up
      return `${roundedMinutes} min read`;
    }
  };
  
  console.log("Rendering ArticleCard with ID:", article.id);
  
  return (
    <div className="article-card animate-fade-in">
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="object-cover w-full h-full" 
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="difficulty-badge bg-black/50 text-white">
              {getCategoryIcon(article.category)} {article.category}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.summary}
          </p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={14} className="mr-1" />
              {readingTime === 0 ? (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">New</span>
              ) : (
                <span>{getReadingTimeDisplay()}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </span>
              <button className="text-muted-foreground hover:text-primary">
                <BookmarkPlus size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
