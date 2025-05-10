
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchNextArticle } from '@/lib/api';
import { ChevronRight } from 'lucide-react';

export interface NextArticleNavigationProps {
  articleId: string;
}

export default function NextArticleNavigation({ articleId }: NextArticleNavigationProps) {
  const { data: nextArticle, isLoading } = useQuery({
    queryKey: ['next-article', articleId],
    queryFn: () => fetchNextArticle(articleId),
    enabled: !!articleId,
  });

  if (isLoading) {
    return (
      <div className="border rounded-md p-4 mt-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-muted rounded w-3/4"></div>
      </div>
    );
  }

  if (!nextArticle) {
    return null;
  }

  return (
    <div className="border rounded-md p-4 mt-6">
      <h3 className="text-sm text-muted-foreground mb-2">Continue reading</h3>
      <Link 
        to={`/article/${nextArticle.id}`} 
        className="flex items-center justify-between group"
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
