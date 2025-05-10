
import { Article } from '@/types';
import { useAuth } from '@/lib/supabase-auth';
import { useQuery } from '@tanstack/react-query';
import { fetchUserPreferences } from '@/lib/api';

interface ArticleContentProps {
  article: Article;
  className?: string;
}

export default function ArticleContent({ article, className = "" }: ArticleContentProps) {
  const { user } = useAuth();
  
  // Fetch user preferences to get difficulty level
  const { data: preferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: () => user ? fetchUserPreferences(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });

  // Get the appropriate summary based on user preferences difficulty level
  const getSummaryByDifficultyLevel = () => {
    // Default to intermediate if no user or preferences found
    const difficultyLevel = preferences?.difficulty_level || 'intermediate';
    
    console.log('User difficulty level:', difficultyLevel);
    
    switch(difficultyLevel) {
      case 'beginner':
        return article.summaryBeginner || article.summary;
      case 'advanced':
        return article.summaryAdvanced || article.summary;
      case 'intermediate':
      default:
        return article.summaryIntermediate || article.summary;
    }
  };

  // If no content available show a message
  if (!article) {
    return (
      <div className={`${className} text-center py-10`}>
        <p className="text-muted-foreground">No content available for this article.</p>
      </div>
    );
  }
  
  // Get the appropriate summary
  const summaryContent = getSummaryByDifficultyLevel();
  
  return (
    <div id="article-content" className={className}>
      <div className="prose prose-sm md:prose-base max-w-none">
        {summaryContent ? (
          <p className="text-lg leading-relaxed">{summaryContent}</p>
        ) : (
          <p className="text-muted-foreground">No summary available for your difficulty level.</p>
        )}
      </div>
    </div>
  );
}
