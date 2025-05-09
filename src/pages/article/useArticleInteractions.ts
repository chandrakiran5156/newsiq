
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { saveArticleInteraction, getUserArticleInteraction } from '@/lib/api';

export default function useArticleInteractions(articleId: string | undefined) {
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's interaction with this article
  const { 
    data: interaction, 
    isLoading: isInteractionLoading, 
    refetch: refetchInteraction 
  } = useQuery({
    queryKey: ['articleInteraction', user?.id, articleId],
    queryFn: () => user && articleId ? getUserArticleInteraction(user.id, articleId) : Promise.resolve(null),
    enabled: !!user && !!articleId,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article interaction:', error);
      }
    }
  });

  // Update article interaction mutation
  const { 
    mutate: updateInteraction, 
    isPending: isUpdating 
  } = useMutation({
    mutationFn: (data: { isRead?: boolean; isSaved?: boolean; readProgress?: number }) => {
      if (!user || !articleId) return Promise.reject('Not authenticated or no article ID');
      return saveArticleInteraction(
        user.id, 
        articleId, 
        data.isRead ?? interaction?.isRead ?? false,
        data.isSaved ?? interaction?.isSaved ?? false,
        data.readProgress ?? readingProgress
      );
    },
    onSuccess: () => {
      refetchInteraction();
    },
    onError: (error) => {
      toast({
        title: "Error updating article interaction",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  // Track reading progress
  useEffect(() => {
    if (!articleId || !user) return;
    
    const handleScroll = () => {
      if (!document.getElementById('article-content')) return;
      
      const totalHeight = document.getElementById('article-content')!.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      const scrolled = Math.min((scrollTop / (totalHeight - windowHeight)) * 100, 100);
      setReadingProgress(scrolled);
      
      // If user has scrolled more than 70% and has stayed for at least 10 seconds,
      // mark article as read
      if (scrolled > 70) {
        const timer = setTimeout(() => {
          updateInteraction({ isRead: true, readProgress: Math.round(scrolled) });
        }, 10000); // 10 seconds
        
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, user]);

  // Update read progress less frequently to reduce database writes
  useEffect(() => {
    if (!articleId || !user) return;
    
    // Update read progress every 60 seconds instead of 30 seconds
    const timer = setInterval(() => {
      if (readingProgress > 0) {
        updateInteraction({ readProgress: Math.round(readingProgress) });
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [readingProgress, articleId, user]);

  const handleSaveToggle = () => {
    updateInteraction({ isSaved: !(interaction?.isSaved) });
    
    toast({
      title: interaction?.isSaved ? "Removed from library" : "Saved to library",
      description: interaction?.isSaved ? 
        "Article has been removed from your library" : 
        "Article has been saved to your library",
    });
  };

  return {
    readingProgress,
    interaction,
    isInteractionLoading,
    isUpdating,
    handleSaveToggle,
    updateInteraction
  };
}
