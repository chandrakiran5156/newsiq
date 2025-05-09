
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Article } from '@/types';
import { categories } from '@/data/mockData';

type ArticleHeaderProps = {
  article: Article;
};

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const categoryData = categories.find(cat => cat.id === article.category) || null;

  return (
    <>
      {/* Back button */}
      <div className="mb-4">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to feed
        </Link>
      </div>

      {/* Article header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {categoryData?.icon} {categoryData?.name}
          </span>
          <span className={`text-sm font-medium difficulty-badge difficulty-badge-${article.difficultyLevel}`}>
            {article.difficultyLevel}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{article.title}</h1>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{article.readTime} min read</span>
          </div>
          <span>By {article.author}</span>
        </div>
      </div>
    </>
  );
}
