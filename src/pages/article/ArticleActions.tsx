
import { Link } from "react-router-dom";
import { Bookmark, BookmarkCheck, CheckCircle, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ArticleActionsProps {
  isSaved: boolean;
  isRead: boolean;
  onSaveToggle: () => void;
  isUpdating?: boolean;
  articleId: string;
  quizExists?: boolean;
  isQuizLoading?: boolean;
}

export default function ArticleActions({
  isSaved,
  isRead,
  onSaveToggle,
  isUpdating = false,
  articleId,
  quizExists,
  isQuizLoading = false,
}: ArticleActionsProps) {
  return (
    <div className="flex items-center justify-between border-t border-b py-3 my-4">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            isSaved && "text-primary"
          )}
          onClick={onSaveToggle}
          disabled={isUpdating}
        >
          {isSaved ? (
            <BookmarkCheck className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
          <span>{isSaved ? "Saved" : "Save"}</span>
        </Button>

        {isRead && (
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary" disabled>
            <CheckCircle className="h-5 w-5" />
            <span>Read</span>
          </Button>
        )}
      </div>

      {!isQuizLoading && quizExists && (
        <Button asChild size="sm" variant="outline" className="flex items-center gap-1">
          <Link to={`/quiz/${articleId}`}>
            <PlayCircle className="h-5 w-5" />
            <span>Take Quiz</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
