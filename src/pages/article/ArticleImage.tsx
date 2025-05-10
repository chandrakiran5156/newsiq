
import { Article } from '@/types';

type ArticleImageProps = {
  article: Article;
};

export default function ArticleImage({ article }: ArticleImageProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full h-auto object-cover max-h-[300px]"
        loading="eager" 
        fetchPriority="high" 
      />
    </div>
  );
}
