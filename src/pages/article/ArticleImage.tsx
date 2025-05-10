
import { Article } from '@/types';

type ArticleImageProps = {
  article: Article;
};

export default function ArticleImage({ article }: ArticleImageProps) {
  return (
    <div className="overflow-hidden">
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="w-full h-auto object-cover"
        loading="eager" 
        fetchPriority="high" 
      />
    </div>
  );
}
