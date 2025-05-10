
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNextArticle } from '@/lib/api';
import { ChevronRight } from 'lucide-react';

export interface NextArticleNavigationProps {
  articleId: string;
}

export default function NextArticleNavigation({ articleId }: NextArticleNavigationProps) {
  console.log("NextArticleNavigation rendering for articleId:", articleId);
  
  const { data: nextArticle, isLoading, error } = useQuery({
    queryKey: ['next-article', articleId],
    queryFn: async () => {
      console.log("Fetching next article for:", articleId);
      try {
        const result = await fetchNextArticle(articleId);
        console.log("Next article fetch result:", result);
        return result;
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
      <div className="border rounded-md p-4 mt-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-muted rounded w-3/4"></div>
      </div>
    );
  }

  if (!nextArticle) {
    console.log("No next article found for:", articleId);
    return null;
  }

  console.log("Next article navigation rendering for:", articleId, "Next article:", nextArticle.id);

  return (
    <div className="border rounded-md p-4 mt-6">
      <h3 className="text-sm text-muted-foreground mb-2">Continue reading</h3>
      <Link 
        to={`/article/${nextArticle.id}`} 
        className="flex items-center justify-between group"
        onClick={() => console.log("Navigating to next article:", nextArticle.id)}
      >
        <div>
          <h4 className="font-medium group-hover:text-primary transition-colors">
            {nextArticle.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {nextArticle.summaryBeginner || nextArticle.summary}
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>
    </div>
  );
}
