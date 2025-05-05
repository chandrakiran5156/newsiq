
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Article } from '@/types';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchArticleById, saveArticleInteraction, getUserArticleInteraction } from '@/lib/api';
import { categories } from '@/data/mockData'; // Only using for category data
import { useAuth } from '@/lib/supabase-auth';
import ArticleChatPanel from '@/components/article-chat/ArticleChatPanel';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch article data with eager loading for better performance
  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? fetchArticleById(id) : Promise.reject('No article ID'),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes to improve loading speed
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article:', error);
        toast({
          title: "Error loading article",
          description: "Could not load the article. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  // Fetch user's interaction with this article
  const { data: interaction, isLoading: isInteractionLoading, refetch: refetchInteraction } = useQuery({
    queryKey: ['articleInteraction', user?.id, id],
    queryFn: () => user && id ? getUserArticleInteraction(user.id, id) : Promise.resolve(null),
    enabled: !!user && !!id,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article interaction:', error);
      }
    }
  });

  // Update article interaction mutation
  const { mutate: updateInteraction, isPending: isUpdating } = useMutation({
    mutationFn: (data: { isRead?: boolean; isSaved?: boolean; readProgress?: number }) => {
      if (!user || !id) return Promise.reject('Not authenticated or no article ID');
      return saveArticleInteraction(
        user.id, 
        id, 
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
    if (!id || !user) return;
    
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
  }, [id, user]);

  // Update read progress less frequently to reduce database writes
  useEffect(() => {
    if (!id || !user) return;
    
    // Update read progress every 60 seconds instead of 30 seconds
    const timer = setInterval(() => {
      if (readingProgress > 0) {
        updateInteraction({ readProgress: Math.round(readingProgress) });
      }
    }, 60000);
    
    return () => clearInterval(timer);
  }, [readingProgress, id, user]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || 'NewsIQ Article',
        text: article?.summary || '',
        url: window.location.href,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard.",
      });
    }
  };

  const handleSaveToggle = () => {
    updateInteraction({ isSaved: !(interaction?.isSaved) });
    
    toast({
      title: interaction?.isSaved ? "Removed from library" : "Saved to library",
      description: interaction?.isSaved ? 
        "Article has been removed from your library" : 
        "Article has been saved to your library",
    });
  };

  const categoryData = article ? categories.find(cat => cat.id === article.category) : null;
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

      {/* Back button */}
      <div className="mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to feed
        </Link>
      </div>

      {/* Article header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {categoryData?.icon} {categoryData?.name}
          </span>
          <span className={`text-sm font-medium difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
            {article.difficultyLevel}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{article.title}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{article.readTime} min read</span>
          </div>
          <span>By {article.author}</span>
        </div>
      </div>

      {/* Article image - optimized for faster loading */}
      <div className="mb-6 rounded-lg overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-auto object-cover"
          loading="eager" // Load immediately for better UX
          fetchPriority="high" // Modern browsers prioritize loading this image
        />
      </div>

      {/* Article content */}
      <div 
        id="article-content"
        className="prose prose-sm sm:prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Actions */}
      <div className="sticky bottom-20 bg-background/95 backdrop-blur-md border border-border rounded-lg p-3 mt-8">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Found this article helpful?
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share size={16} className="mr-2" /> Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveToggle}
              disabled={isUpdating || isInteractionLoading}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={16} className="mr-2 text-primary" /> Saved
                </>
              ) : (
                <>
                  <Bookmark size={16} className="mr-2" /> Save
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate(`/quiz/${article.id}`)}
            >
              Take Quiz
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {article && <ArticleChatPanel article={article} />}
    </div>
  );
}
