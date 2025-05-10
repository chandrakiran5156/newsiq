
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticleById, checkQuizExistsByArticleId } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import useArticleInteractions from "./useArticleInteractions";
import ArticleHeader from "./ArticleHeader";
import ArticleImage from "./ArticleImage";
import ArticleContent from "./ArticleContent";
import ArticleActions from "./ArticleActions";
import NextArticleNavigation from "./NextArticleNavigation";
import ArticleChatPanel from "@/components/article-chat/ArticleChatPanel";
import { AchievementNotification } from "@/components/achievements/AchievementNotification";

export default function ArticlePage() {
  const { articleId } = useParams();
  const { toast } = useToast();
  
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => articleId ? fetchArticleById(articleId) : Promise.reject("No article ID"),
    enabled: !!articleId,
  });

  // Check if article has a quiz
  const { data: quizExists, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quiz-exists", articleId],
    queryFn: () => articleId ? checkQuizExistsByArticleId(articleId) : Promise.reject("No article ID"),
    enabled: !!articleId,
  });

  const { 
    interaction, 
    isInteractionLoading, 
    handleSaveToggle,
    earnedAchievement
  } = useArticleInteractions(articleId);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article. Please try again.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-4">
        <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
        <p className="text-muted-foreground text-center">
          The article you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-6">
          <ArticleHeader article={article} />
          <ArticleImage article={article} />
          <ArticleActions 
            isSaved={interaction?.isSaved || false}
            isRead={interaction?.isRead || false}
            onSaveToggle={handleSaveToggle}
            isUpdating={isInteractionLoading}
            articleId={article.id}
            quizExists={quizExists}
            isQuizLoading={isQuizLoading}
          />
          <ArticleContent article={article} />
          <NextArticleNavigation articleId={article.id} />
        </div>
        <div className="lg:w-1/3 mt-6 lg:mt-0">
          <ArticleChatPanel article={article} />
        </div>
      </div>
      
      {earnedAchievement && (
        <AchievementNotification 
          achievementName={earnedAchievement} 
          onDismiss={() => {}} 
        />
      )}
    </div>
  );
}
