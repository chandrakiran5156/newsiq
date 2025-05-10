
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchArticleById, fetchUserPreferences, fetchNextArticle } from '@/lib/api';
import { useAuth } from '@/lib/supabase-auth';
import ArticleChatPanel from '@/components/article-chat/ArticleChatPanel';
import useArticleInteractions from './useArticleInteractions';
import ArticleHeader from './ArticleHeader';
import ArticleImage from './ArticleImage';
import ArticleContent from './ArticleContent';
import NextArticleNavigation from './NextArticleNavigation';
import ArticleActions from './ArticleActions';
import { Link } from 'react-router-dom';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // Custom hook for article interactions
  const {
    readingProgress,
    interaction,
    isInteractionLoading,
    isUpdating,
    handleSaveToggle
  } = useArticleInteractions(id);

  // Fetch article data with eager loading for better performance
  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? fetchArticleById(id) : Promise.reject('No article ID'),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to improve loading speed
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article:', error);
      }
    }
  });
  
  // Fetch user preferences to determine which summary to show
  const { data: preferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: () => user ? fetchUserPreferences(user.id) : Promise.reject('No user'),
    enabled: !!user,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch user preferences:', error);
      }
    }
  });

  // Fetch next article
  const { data: nextArticle } = useQuery({
    queryKey: ['nextArticle', id],
    queryFn: () => id ? fetchNextArticle(id) : Promise.reject('No article ID'),
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });
  
  // Fetch previous article
  const { data: previousArticle } = useQuery({
    queryKey: ['previousArticle', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        // Assuming fetchNextArticle can be reused with a "previous" flag
        // If not, you would need to create a new API function
        const response = await fetch(`/api/articles/${id}/previous`);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        console.error('Error fetching previous article:', error);
        return null;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  });

  // Check if quiz exists for this article
  const { data: quizExists, isLoading: isQuizLoading } = useQuery({
    queryKey: ['quizExists', id],
    queryFn: async () => {
      if (!id) return false;
      try {
        const response = await fetch(`/api/quizzes/check/${id}`);
        if (!response.ok) return false;
        const data = await response.json();
        return !!data.exists;
      } catch (error) {
        console.error('Error checking quiz existence:', error);
        return false;
      }
    },
    enabled: !!id
  });

  const isSaved = interaction?.isSaved || false;

  if (isArticleLoading) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-64 w-full mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <p className="text-2xl font-semibold">Article not found</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10 relative">
      {/* Reading progress */}
      <div className="fixed top-[56px] left-0 right-0 h-1 bg-muted z-10">
        <div 
          className="h-full bg-primary" 
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      {/* Article header with title, author, etc. */}
      <ArticleHeader article={article} />
      
      {/* Article image */}
      <ArticleImage article={article} />
      
      {/* Article content */}
      <ArticleContent article={article} />

      {/* Actions - save, share, quiz */}
      <ArticleActions 
        articleId={article.id}
        isSaved={isSaved}
        isUpdating={isUpdating}
        isQuizLoading={isQuizLoading}
        quizExists={quizExists}
        onSaveToggle={handleSaveToggle}
      />

      {/* Navigation between articles - moved after the actions */}
      <NextArticleNavigation nextArticle={nextArticle} previousArticle={previousArticle} />

      {/* Chat Panel */}
      <div className="mt-16">
        {article && <ArticleChatPanel article={article} />}
      </div>
    </div>
  );
}
