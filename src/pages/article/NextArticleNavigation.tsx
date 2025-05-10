
import { Article } from '@/types';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type NextArticleNavigationProps = {
  nextArticle: Article | null;
  previousArticle: Article | null;
};

export default function NextArticleNavigation({ nextArticle, previousArticle }: NextArticleNavigationProps) {
  const navigate = useNavigate();
  
  if (!nextArticle && !previousArticle) return null;

  return (
    <div className="mt-8 border-t pt-4">
      <h3 className="text-lg font-medium mb-2">Continue Reading</h3>
      <div className="flex flex-col gap-3">
        {previousArticle && (
          <div className="bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/article/${previousArticle.id}`)}
                className="flex items-center gap-1 p-0 h-auto"
              >
                <ArrowLeft size={16} /> Previous Article
              </Button>
            </div>
            <Link 
              to={`/article/${previousArticle.id}`}
              className="block"
            >
              <p className="font-medium line-clamp-2">{previousArticle.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{previousArticle.category}</span>
              </div>
            </Link>
          </div>
        )}
        
        {nextArticle && (
          <div className="bg-muted/30 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/article/${nextArticle.id}`)}
                className="flex items-center gap-1 ml-auto p-0 h-auto"
              >
                Next Article <ArrowRight size={16} />
              </Button>
            </div>
            <Link 
              to={`/article/${nextArticle.id}`}
              className="block"
            >
              <p className="font-medium line-clamp-2">{nextArticle.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{nextArticle.category}</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
