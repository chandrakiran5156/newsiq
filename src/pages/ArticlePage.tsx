
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { mockArticles } from '@/data/mockData';
import { Article } from '@/types';
import { ArrowLeft, Bookmark, Clock, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/data/mockData';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch article
    const fetchArticle = () => {
      setIsLoading(true);
      // Find article in mock data
      const found = mockArticles.find(a => a.id === id);
      
      // Simulate network delay
      setTimeout(() => {
        setArticle(found || null);
        setIsLoading(false);
      }, 500);
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!document.getElementById('article-content')) return;
      
      const totalHeight = document.getElementById('article-content')!.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      const scrolled = Math.min((scrollTop / (totalHeight - windowHeight)) * 100, 100);
      setReadingProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

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

  const categoryData = article ? categories.find(cat => cat.id === article.category) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Loading article...</p>
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

      {/* Article image */}
      <div className="mb-6 rounded-lg overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-auto object-cover"
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
            <Button variant="outline" size="sm">
              <Bookmark size={16} className="mr-2" /> Save
            </Button>
            <Button size="sm" asChild>
              <Link to={`/quiz/${article.id}`}>
                Take Quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
