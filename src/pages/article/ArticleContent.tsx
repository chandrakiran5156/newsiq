
import { Article } from '@/types';

interface ArticleContentProps {
  article: Article;
  className?: string;
}

export default function ArticleContent({ article, className = "" }: ArticleContentProps) {
  // Check if content exists before rendering
  if (!article?.content) {
    return (
      <div className={`${className} text-center py-10`}>
        <p className="text-muted-foreground">No content available for this article.</p>
      </div>
    );
  }
  
  return (
    <div id="article-content" className={className}>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
