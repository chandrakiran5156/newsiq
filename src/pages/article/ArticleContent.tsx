
import { useState, useEffect } from 'react';
import { Article } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { fetchUserPreferences } from '@/lib/api';
import { useAuth } from '@/lib/supabase-auth';

type ArticleContentProps = {
  article: Article;
};

export default function ArticleContent({ article }: ArticleContentProps) {
  const { user } = useAuth();
  const [processedContent, setProcessedContent] = useState(article.content);
  
  // Fetch user preferences for content display
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

  // Process content to remove summary prefixes and show appropriate content based on user preference
  useEffect(() => {
    if (!article.content) {
      setProcessedContent("");
      return;
    }

    let content = article.content;
    
    // Remove all summary prefixes
    content = content.replace(/summary_beginner:/gi, '');
    content = content.replace(/summary_intermediate:/gi, '');
    content = content.replace(/summary_advanced:/gi, '');
    
    // Check for user preference
    if (user && preferences) {
      const difficultyLevel = preferences.difficulty_level || 'intermediate';
      
      // Only show the summary appropriate for the user's skill level
      if (difficultyLevel === 'beginner' && article.summaryBeginner) {
        content = article.summaryBeginner;
      } else if (difficultyLevel === 'intermediate' && article.summaryIntermediate) {
        content = article.summaryIntermediate;
      } else if (difficultyLevel === 'advanced' && article.summaryAdvanced) {
        content = article.summaryAdvanced;
      }
      
      // Remove any remaining summary labels
      content = content.replace(/summary_beginner:/gi, '');
      content = content.replace(/summary_intermediate:/gi, '');
      content = content.replace(/summary_advanced:/gi, '');
    }
    
    setProcessedContent(content);
  }, [article.content, article.summaryBeginner, article.summaryIntermediate, article.summaryAdvanced, preferences, user]);

  return (
    <div 
      id="article-content"
      className="prose prose-sm sm:prose max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
