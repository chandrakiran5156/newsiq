
import { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { saveArticleInteraction, getUserArticleInteraction, checkReaderAchievement } from '@/lib/api';

export default function useArticleInteractions(articleId: string | undefined) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTimeInSeconds, setReadingTimeInSeconds] = useState(0);
  const readingIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const [earnedAchievement, setEarnedAchievement] = useState<string | null>(null);

  console.log("useArticleInteractions hook initialized with articleId:", articleId);
  console.log("Current user:", user?.id);

  // Fetch user's interaction with this article
  const { 
    data: interaction, 
    isLoading: isInteractionLoading, 
    refetch: refetchInteraction 
  } = useQuery({
    queryKey: ['articleInteraction', user?.id, articleId],
    queryFn: () => {
      console.log("Fetching article interaction for:", user?.id, articleId);
      if (!user || !articleId) {
        console.log("Missing user or articleId for interaction fetch");
        return Promise.resolve(null);
      }
      return getUserArticleInteraction(user.id, articleId);
    },
    enabled: !!user && !!articleId,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article interaction:', error);
      }
    }
  });

  // Log when interaction data changes
  useEffect(() => {
    console.log("Article interaction data:", interaction);
  }, [interaction]);

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
      console.log("Updating article interaction:", data);
      if (!user || !articleId) {
        console.error("Cannot update interaction: No user or articleId");
        return Promise.reject('Not authenticated or no article ID');
      }
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
      console.log("Article interaction updated successfully");
      refetchInteraction();
      
      // Check for reader achievement
      if (user && hasMarkedAsRead) {
        const result = await checkReaderAchievement(user.id);
        if (result && result.achievementEarned) {
          setEarnedAchievement(result.achievementName);
          
          toast({
            title: "Achievement Unlocked!",
            description: `${result.achievementName}: ${result.achievementDesc}`,
            variant: "default"
          });
        }
      }
    },
    onError: (error) => {
      console.error("Error updating article interaction:", error);
      toast({
        title: "Error updating article interaction",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  // Start tracking reading time when component mounts
  useEffect(() => {
    if (!articleId || !user) {
      console.log("Not tracking reading time - missing articleId or user");
      return;
    }
    
    // Set initial reading time from database if available
    if (interaction?.read_time) {
      console.log("Setting initial reading time from DB:", interaction.read_time);
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
    if (!articleId || !user || hasMarkedAsRead || (interaction?.isRead)) {
      return;
    }
    
    if (readingTimeInSeconds >= 10 && !hasMarkedAsRead) {
      console.log(`Marking article ${articleId} as read after ${readingTimeInSeconds} seconds`);
      updateInteraction({ 
        isRead: true,
        readTime: readingTimeInSeconds
      });
      setHasMarkedAsRead(true);
      
      // Show toast notification with correct variant
      toast({
        title: "Article marked as read",
        description: "You've spent enough time reading this article",
        variant: "default"
      });
    }
  }, [readingTimeInSeconds, articleId, user, hasMarkedAsRead, interaction?.isRead, updateInteraction, toast]);

  // Track reading progress
  useEffect(() => {
    if (!articleId || !user) return;
    
    const handleScroll = () => {
      const contentElement = document.getElementById('article-content');
      if (!contentElement) {
        console.log("Article content element not found");
        return;
      }
      
      const totalHeight = contentElement.offsetHeight;
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
  }, [articleId, user, readingTimeInSeconds, hasMarkedAsRead, interaction?.isRead, updateInteraction]);

  // Update read progress and time less frequently to reduce database writes
  useEffect(() => {
    if (!articleId || !user) return;
    
    // Update read progress every 60 seconds
    const timer = setInterval(() => {
      if (readingProgress > 0) {
        console.log(`Periodic update: progress ${Math.round(readingProgress)}%, time ${readingTimeInSeconds}s`);
        updateInteraction({ 
          readProgress: Math.round(readingProgress),
          readTime: readingTimeInSeconds 
        });
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [readingProgress, articleId, user, readingTimeInSeconds, updateInteraction]);

  // Save reading time when user leaves the page
  useEffect(() => {
    if (!articleId || !user) return;
    
    const handleBeforeUnload = () => {
      console.log(`Saving reading time (${readingTimeInSeconds}s) before unload`);
      updateInteraction({ readTime: readingTimeInSeconds });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [articleId, user, readingTimeInSeconds, updateInteraction]);

  const handleSaveToggle = () => {
    console.log(`Toggling save status for article ${articleId} from ${interaction?.isSaved ? 'saved' : 'not saved'} to ${!interaction?.isSaved ? 'saved' : 'not saved'}`);
    updateInteraction({ isSaved: !(interaction?.isSaved) });
    
    toast({
      title: interaction?.isSaved ? "Removed from library" : "Saved to library",
      description: interaction?.isSaved ? 
        "Article has been removed from your library" : 
        "Article has been saved to your library",
      variant: "default"
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
