
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNextArticle } from '@/lib/api';
import { ChevronRight } from 'lucide-react';

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
        // For now, we're reusing the existing API but in a production app
        // you might want to fetch multiple next articles
        const result = await fetchNextArticle(articleId);
        console.log("Next article fetch result:", result);
        return [result]; // Wrap in array for now
      } catch (err) {
        console.error("Error fetching next article:", err);
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
        {[1, 2, 3].map((i) => (
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
    return null;
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
            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {article.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {article.category}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ))}
    </div>
  );
}
