
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { saveArticleInteraction, getUserArticleInteraction, checkReaderAchievement } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

export default function useArticleInteractions(articleId: string | undefined) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTimeInSeconds, setReadingTimeInSeconds] = useState(0);
  const readingIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const [earnedAchievement, setEarnedAchievement] = useState<string | null>(null);

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
    mutationFn: (data: { 
      isRead?: boolean; 
      isSaved?: boolean; 
      readProgress?: number;
      readTime?: number;
    }) => {
      if (!user || !articleId) return Promise.reject('Not authenticated or no article ID');
      return saveArticleInteraction(
        user.id, 
        articleId, 
        data.isRead ?? interaction?.isRead ?? false,
        data.isSaved ?? interaction?.isSaved ?? false,
        data.readProgress ?? readingProgress,
        data.readTime ?? readingTimeInSeconds
      );
    },
    onSuccess: async () => {
      refetchInteraction();
      
      // Check for reader achievement
      if (user && hasMarkedAsRead) {
        const result = await checkReaderAchievement(user.id);
        if (result && result.achievementEarned) {
          setEarnedAchievement(result.achievementName);
          
          toast({
            title: "Achievement Unlocked!",
            description: `${result.achievementName}: ${result.achievementDesc}`,
            variant: "success"
          });
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Error updating article interaction",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  // Start tracking reading time when component mounts
  useEffect(() => {
    if (!articleId || !user) return;
    
    // Set initial reading time from database if available
    if (interaction?.read_time) {
      setReadingTimeInSeconds(interaction.read_time);
    }
    
    // Start a timer that increments reading time every second
    readingIntervalRef.current = window.setInterval(() => {
      setReadingTimeInSeconds(prevTime => prevTime + 1);
    }, 1000);
    
    // Clean up interval when unmounting
    return () => {
      if (readingIntervalRef.current) {
        window.clearInterval(readingIntervalRef.current);
      }
    };
  }, [articleId, user, interaction]);

  // Mark as read after 10 seconds of reading
  useEffect(() => {
    if (!articleId || !user || hasMarkedAsRead || (interaction?.isRead)) return;
    
    if (readingTimeInSeconds >= 10 && !hasMarkedAsRead) {
      console.log(`Marking article ${articleId} as read after ${readingTimeInSeconds} seconds`);
      updateInteraction({ 
        isRead: true,
        readTime: readingTimeInSeconds
      });
      setHasMarkedAsRead(true);
      
      // Show toast notification
      toast({
        title: "Article marked as read",
        description: "You've spent enough time reading this article",
      });
    }
  }, [readingTimeInSeconds, articleId, user, hasMarkedAsRead, interaction?.isRead, updateInteraction]);

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
      if (scrolled > 70 && readingTimeInSeconds >= 10 && !hasMarkedAsRead && !interaction?.isRead) {
        console.log(`Marking article ${articleId} as read after scrolling ${scrolled}% and reading for ${readingTimeInSeconds} seconds`);
        updateInteraction({ 
          isRead: true, 
          readProgress: Math.round(scrolled),
          readTime: readingTimeInSeconds 
        });
        setHasMarkedAsRead(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, user, readingTimeInSeconds, hasMarkedAsRead, interaction?.isRead]);

  // Update read progress and time less frequently to reduce database writes
  useEffect(() => {
    if (!articleId || !user) return;
    
    // Update read progress every 60 seconds instead of 30 seconds
    const timer = setInterval(() => {
      if (readingProgress > 0) {
        updateInteraction({ 
          readProgress: Math.round(readingProgress),
          readTime: readingTimeInSeconds 
        });
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [readingProgress, articleId, user, readingTimeInSeconds]);

  // Save reading time when user leaves the page
  useEffect(() => {
    if (!articleId || !user) return;
    
    const handleBeforeUnload = () => {
      updateInteraction({ readTime: readingTimeInSeconds });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [articleId, user, readingTimeInSeconds]);

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
    readingTimeInSeconds,
    interaction,
    isInteractionLoading,
    isUpdating,
    handleSaveToggle,
    updateInteraction,
    hasMarkedAsRead,
    earnedAchievement
  };
}
