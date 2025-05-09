
import { Article } from '@/types';

type ArticleImageProps = {
  article: Article;
};

export default function ArticleImage({ article }: ArticleImageProps) {
  return (
    <div className="mb-6 rounded-lg overflow-hidden max-h-[300px]">
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
