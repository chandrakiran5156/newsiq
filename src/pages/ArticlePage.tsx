
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Article } from '@/types';
import { ArrowLeft, Bookmark, BookmarkCheck, Clock, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { fetchArticleById, saveArticleInteraction, getUserArticleInteraction } from '@/lib/api';
import { mockArticles, categories } from '@/data/mockData'; // Fallback
import { useAuth } from '@/lib/supabase-auth';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch article data
  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => id ? fetchArticleById(id) : Promise.reject('No article ID'),
    onError: () => {
      console.error('Failed to fetch article, using mock data');
      // You could set a fallback article from mockArticles here
    }
  });

  // Fetch user's interaction with this article
  const { data: interaction, isLoading: isInteractionLoading, refetch: refetchInteraction } = useQuery({
    queryKey: ['articleInteraction', user?.id, id],
    queryFn: () => user && id ? getUserArticleInteraction(user.id, id) : Promise.resolve(null),
    enabled: !!user && !!id,
    onError: () => {
      console.error('Failed to fetch article interaction');
    }
  });

  // Update article interaction mutation
  const { mutate: updateInteraction, isPending: isUpdating } = useMutation({
    mutationFn: (data: { isRead?: boolean; isSaved?: boolean; readProgress?: number }) => {
      if (!user || !id) return Promise.reject('Not authenticated or no article ID');
      return saveArticleInteraction(
        user.id, 
        id, 
        data.isRead ?? interaction?.is_read ?? false,
        data.isSaved ?? interaction?.is_saved ?? false,
        data.readProgress ?? interaction?.read_progress ?? 0
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

  // Update read progress periodically
  useEffect(() => {
    if (!id || !user) return;
    
    // Update read progress every 30 seconds
    const timer = setInterval(() => {
      if (readingProgress > 0) {
        updateInteraction({ readProgress: Math.round(readingProgress) });
      }
    }, 30000);
    
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
    updateInteraction({ isSaved: !(interaction?.is_saved) });
    
    toast({
      title: interaction?.is_saved ? "Removed from library" : "Saved to library",
      description: interaction?.is_saved ? 
        "Article has been removed from your library" : 
        "Article has been saved to your library",
    });
  };

  // Fallback to mock article if API fails
  const displayArticle = article || (id ? mockArticles.find(a => a.id === id) : null);
  const categoryData = displayArticle ? categories.find(cat => cat.id === displayArticle.category) : null;
  const isSaved = interaction?.is_saved || false;

  if (isArticleLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (!displayArticle) {
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
          <span className={`text-sm font-medium difficulty-badge difficulty-badge-${displayArticle.difficultyLevel}`}>
            {displayArticle.difficultyLevel}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{displayArticle.title}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{displayArticle.readTime} min read</span>
          </div>
          <span>By {displayArticle.author}</span>
        </div>
      </div>

      {/* Article image */}
      <div className="mb-6 rounded-lg overflow-hidden">
        <img 
          src={displayArticle.imageUrl} 
          alt={displayArticle.title} 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Article content */}
      <div 
        id="article-content"
        className="prose prose-sm sm:prose max-w-none"
        dangerouslySetInnerHTML={{ __html: displayArticle.content }}
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
              onClick={() => navigate(`/quiz/${displayArticle.id}`)}
            >
              Take Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
