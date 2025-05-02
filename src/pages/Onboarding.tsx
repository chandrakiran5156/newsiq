
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';
import { supabase } from '@/integrations/supabase/client';
import { Category, DifficultyLevel } from '@/types';

const categories: { id: Category; name: string; icon: string }[] = [
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'politics', name: 'Politics', icon: '🏛️' },
  { id: 'business', name: 'Business', icon: '📊' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'education', name: 'Education', icon: '📚' },
];

const difficultyLevels: { id: DifficultyLevel; name: string; description: string }[] = [
  { 
    id: 'beginner', 
    name: 'Beginner', 
    description: 'Simple language, short articles, basic concepts' 
  },
  { 
    id: 'intermediate', 
    name: 'Intermediate', 
    description: 'More detailed articles with some specialized terminology' 
  },
  { 
    id: 'advanced', 
    name: 'Advanced', 
    description: 'In-depth analysis, technical concepts, specialized topics' 
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['technology', 'business']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('intermediate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleCategoryToggle = (category: Category) => {
    if (selectedCategories.includes(category)) {
      // Don't allow deselecting all categories
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== category));
      }
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    setSelectedDifficulty(difficulty);
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Update user preferences in Supabase
      const { error } = await supabase
        .from('user_preferences')
        .update({
          categories: selectedCategories,
          difficulty_level: selectedDifficulty,
        })
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated successfully!",
      });
      
      navigate('/home');
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/10">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Welcome to NewsIQ</h1>
          <p className="text-muted-foreground">Let's personalize your experience</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={`step-${currentStep}`}>
              <TabsList className="grid grid-cols-2 w-full mb-8">
                <TabsTrigger 
                  value="step-0"
                  disabled
                  className={`${currentStep === 0 ? "bg-primary text-primary-foreground" : ""}`}
                >
                  1. Select Topics
                </TabsTrigger>
                <TabsTrigger 
                  value="step-1"
                  disabled
                  className={`${currentStep === 1 ? "bg-primary text-primary-foreground" : ""}`}
                >
                  2. Choose Difficulty
                </TabsTrigger>
              </TabsList>

              <TabsContent value="step-0" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Select topics you're interested in</h2>
                  <p className="text-muted-foreground mb-6">
                    Choose categories that interest you the most. We'll personalize your news feed based on your selections.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                        className="h-auto py-4 px-3 flex flex-col items-center justify-center gap-2"
                        onClick={() => handleCategoryToggle(category.id)}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.name}</span>
                        {selectedCategories.includes(category.id) && (
                          <Badge variant="secondary" className="bg-primary/20">
                            <CheckIcon className="h-3 w-3 mr-1" /> Selected
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="step-1" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose your content complexity</h2>
                  <p className="text-muted-foreground mb-6">
                    Select the difficulty level that best matches your knowledge and preferences.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {difficultyLevels.map(level => (
                      <div
                        key={level.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedDifficulty === level.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => handleDifficultySelect(level.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{level.name}</h3>
                          {selectedDifficulty === level.id && (
                            <CheckIcon className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevious}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Get Started"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
