
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ArticleActionsProps = {
  articleId: string;
  isSaved: boolean;
  isUpdating: boolean;
  isQuizLoading: boolean;
  quizExists: boolean | undefined;
  onSaveToggle: () => void;
};

export default function ArticleActions({ 
  articleId,
  isSaved,
  isUpdating,
  isQuizLoading,
  quizExists,
  onSaveToggle
}: ArticleActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'NewsIQ Article',
        text: '',
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

  return (
    <div className="sticky bottom-4 bg-background/95 backdrop-blur-md border border-border rounded-lg p-3 mt-8 z-20">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium hidden sm:block">
          Found this article helpful?
        </span>
        <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share size={16} className="mr-2" /> Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSaveToggle}
            disabled={isUpdating}
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
            onClick={() => navigate(`/quiz/${articleId}`)}
            disabled={isQuizLoading || quizExists === false}
          >
            {isQuizLoading ? "Checking..." : (quizExists === true ? "Take Quiz" : "No Quiz Available")}
          </Button>
        </div>
      </div>
    </div>
  );
}
