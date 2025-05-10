
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ArticleActionsProps = {
  articleId: string;
  isSaved: boolean;
  isRead?: boolean; // Added isRead as optional prop
  isUpdating?: boolean; // Made isUpdating optional
  isQuizLoading?: boolean; // Added isQuizLoading as optional
  quizExists?: boolean | undefined; // Added quizExists prop
  onSaveToggle: () => void;
};

export default function ArticleActions({ 
  articleId,
  isSaved,
  isRead,
  isUpdating,
  isQuizLoading,
  quizExists,
  onSaveToggle
}: ArticleActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="sticky bottom-4 bg-background/95 backdrop-blur-md border border-border rounded-lg p-3 mt-8 z-20">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium hidden sm:block">
          Found this article helpful?
        </span>
        <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
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
