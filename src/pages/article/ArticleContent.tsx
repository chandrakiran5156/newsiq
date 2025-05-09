
import { Article } from '@/types';

type ArticleContentProps = {
  article: Article;
};

export default function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div 
      id="article-content"
      className="prose prose-sm sm:prose max-w-none"
      dangerouslySetInnerHTML={{ __html: article.content }}
    />
  );
}
