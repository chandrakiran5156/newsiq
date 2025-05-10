
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Log the path that caused the 404 for debugging purposes
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been removed.
          {location.pathname.includes('/article/') && (
            " The article may have been moved or deleted."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <Link to="/discover">
              <Search className="h-4 w-4" />
              Browse Articles
            </Link>
          </Button>
          
          <Button asChild variant="default" className="flex items-center gap-2">
            <Link to="/home">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
