
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Separator } from "@/components/ui/separator";

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Add comprehensive debugging logs
  console.log("Article page loaded with articleId:", articleId);
  
  const { 
    data: article, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      console.log("Fetching article with ID:", articleId);
      if (!articleId) {
        console.error("No article ID provided in URL params");
        throw new Error("No article ID provided");
      }
      
      try {
        const articleData = await fetchArticleById(articleId);
        console.log("Article data fetched:", articleData);
        return articleData;
      } catch (err) {
        console.error("Error fetching article:", err);
        throw err;
      }
    },
    enabled: !!articleId,
    retry: 1
  });

  // Log the article data when it changes
  useEffect(() => {
    console.log("Article data in component:", article);
  }, [article]);
  
  // Check if article has a quiz
  const { data: quizExists, isLoading: isQuizLoading } = useQuery({
    queryKey: ["quiz-exists", articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("No article ID provided");
      return checkQuizExistsByArticleId(articleId);
    },
    enabled: !!articleId,
  });

  const { 
    interaction, 
    isInteractionLoading, 
    handleSaveToggle,
    earnedAchievement
  } = useArticleInteractions(articleId);
  
  // Redirect to NotFound page if there's an error fetching the article
  useEffect(() => {
    if (isError) {
      console.error("Error loading article:", error);
      toast({
        title: "Error loading article",
        description: "There was a problem loading the article. Please try again.",
        variant: "destructive",
      });
      
      // Redirect to NotFound with a more graceful UX
      // Using a short timeout to allow the toast to be visible first
      const timer = setTimeout(() => {
        navigate("/not-found");
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isError, error, toast, navigate]);

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
    <div className="container max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column - Article Image */}
        <div className="md:col-span-3 space-y-4">
          <div className="rounded-lg overflow-hidden">
            <ArticleImage article={article} />
          </div>
          
          <ArticleActions 
            isSaved={interaction?.isSaved || false}
            isRead={interaction?.isRead || false}
            onSaveToggle={handleSaveToggle}
            isUpdating={isInteractionLoading}
            articleId={article.id}
            quizExists={quizExists}
            isQuizLoading={isQuizLoading}
          />
        </div>
        
        {/* Middle column - Article Content */}
        <div className="md:col-span-7 space-y-6">
          <ArticleHeader article={article} />
          <Separator />
          <ArticleContent article={article} className="prose prose-sm md:prose-base max-w-none" />
          
          {/* Chat panel integrated in the middle column */}
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">Chat about this article</h3>
            <ArticleChatPanel article={article} />
          </div>
        </div>
        
        {/* Right column - Next Articles */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-medium text-lg">Read Next</h3>
          <NextArticleNavigation articleId={article.id} />
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
