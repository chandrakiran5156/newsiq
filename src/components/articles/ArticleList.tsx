
import { Article } from '@/types';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Clock } from 'lucide-react';
import { categories } from '@/data/mockData'; // Only using for category icons

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">No articles found</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {articles.map(article => {
        const categoryData = categories.find(cat => cat.id === article.category);
        
        return (
          <Link 
            key={article.id} 
            to={`/article/${article.id}`} 
            className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex h-24">
              <div className="w-24 flex-shrink-0">
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium line-clamp-2 text-sm">{article.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="mr-2">{categoryData?.icon}</span>
                    <Clock size={12} className="mr-1" />
                    <span>{article.readTime} min</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
