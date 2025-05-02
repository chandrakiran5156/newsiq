
import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { BookmarkPlus, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Get category icon based on category name
  const getCategoryIcon = (category: string) => {
    const categoryIcons: Record<string, string> = {
      'technology': '💻',
      'science': '🔬',
      'politics': '🏛️',
      'business': '💼',
      'finance': '💰',
      'health': '🏥',
      'sports': '⚽',
      'entertainment': '🎬',
      'education': '📚'
    };
    
    return categoryIcons[category] || '📄';
  };
  
  return (
    <div className="article-card animate-fade-in">
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative h-40 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="object-cover w-full h-full" 
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="difficulty-badge difficulty-badge-beginner bg-black/50 text-white">
              {getCategoryIcon(article.category)} {article.category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <span className={`difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
              {article.difficultyLevel}
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold line-clamp-2 mb-2">{article.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {article.summary}
          </p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={14} className="mr-1" />
              <span>{article.readTime} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
              </span>
              <button className="text-muted-foreground hover:text-primary">
                <BookmarkPlus size={16} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
