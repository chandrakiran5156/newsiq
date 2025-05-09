
import { Article } from '@/types';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

type NextArticleNavigationProps = {
  nextArticle: Article | null;
};

export default function NextArticleNavigation({ nextArticle }: NextArticleNavigationProps) {
  const navigate = useNavigate();
  
  if (!nextArticle) return null;

  return (
    <div className="mt-8 border-t pt-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Continue Reading</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/article/${nextArticle.id}`)}
          className="flex items-center gap-1"
        >
          Next Article <ArrowRight size={16} />
        </Button>
      </div>
      <div className="mt-2 bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-colors">
        <Link 
          to={`/article/${nextArticle.id}`}
          className="block"
        >
          <p className="font-medium line-clamp-2">{nextArticle.title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{nextArticle.category}</span>
            <span>•</span>
            <span>{nextArticle.readTime} min read</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
