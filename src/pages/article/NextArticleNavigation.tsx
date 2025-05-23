
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRecommendedArticles } from '@/lib/api';
import { ChevronRight } from 'lucide-react';
import { Article } from '@/types';

export interface NextArticleNavigationProps {
  articleId: string;
}

export default function NextArticleNavigation({ articleId }: NextArticleNavigationProps) {
  console.log("NextArticleNavigation rendering for articleId:", articleId);
  
  const { data: nextArticles, isLoading, error } = useQuery({
    queryKey: ['next-articles', articleId],
    queryFn: async () => {
      console.log("Fetching next articles for:", articleId);
      try {
        // Fetch 5 recommended articles from the database
        const articles = await fetchRecommendedArticles(articleId, 5);
        console.log("Fetched recommended articles:", articles);
        return articles;
      } catch (err) {
        console.error("Error fetching next articles:", err);
        throw err;
      }
    },
    enabled: !!articleId,
  });

  if (error) {
    console.error("Error in next article navigation:", error);
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border rounded-md p-2 animate-pulse">
            <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
            <div className="h-2 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!nextArticles || nextArticles.length === 0) {
    console.log("No next articles found for:", articleId);
    return (
      <div className="border rounded-md p-3">
        <p className="text-sm text-muted-foreground">No related articles found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nextArticles.map(article => (
        <Link 
          key={article.id}
          to={`/article/${article.id}`} 
          className="border rounded-md p-3 flex items-center justify-between group hover:border-primary transition-colors block"
          onClick={() => console.log("Navigating to next article:", article.id)}
        >
          <div>
            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {article.category}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ))}
    </div>
  );
}
