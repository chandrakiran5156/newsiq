import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRecommendedArticles } from '@/lib/api';
import { ChevronRight } from 'lucide-react';

export interface NextArticleNavigationProps {
  articleId: string; // Added articleId to props
}

export default function NextArticleNavigation({ articleId }: NextArticleNavigationProps) {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const { data: recommendedArticles, isLoading } = useQuery({
    queryKey: ['recommended-articles', articleId],
    queryFn: () => fetchRecommendedArticles(articleId),
    enabled: !!articleId,
  });

  if (isLoading || !recommendedArticles || recommendedArticles.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t">
      <h3 className="font-medium mb-2">Continue Reading</h3>
      <div className="space-y-2">
        {recommendedArticles.slice(0, 3).map((article, index) => (
          <Link
            key={article.id}
            to={`/article/${article.id}`}
            className="block"
            onMouseEnter={() => setIsHovered(index)}
            onMouseLeave={() => setIsHovered(null)}
          >
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
              <div>
                <h4 className="font-medium line-clamp-1">{article.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {article.summary}
                </p>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-muted-foreground transition-transform ${
                  isHovered === index ? 'transform translate-x-1' : ''
                }`}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
