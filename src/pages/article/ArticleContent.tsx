
import { Article } from '@/types';

interface ArticleContentProps {
  article: Article;
  className?: string;
}

export default function ArticleContent({ article, className = "" }: ArticleContentProps) {
  return (
    <div id="article-content" className={className}>
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
