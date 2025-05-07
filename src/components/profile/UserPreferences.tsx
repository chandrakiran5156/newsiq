import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchUserPreferences, updateUserPreferences } from "@/lib/api";
import { useAuth } from "@/lib/supabase-auth";
import { Category, DifficultyLevel } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Settings2 } from "lucide-react";

const categories: { value: Category; label: string }[] = [
  { value: "technology", label: "Technology" },
  { value: "science", label: "Science" },
  { value: "politics", label: "Politics" },
  { value: "business", label: "Business" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "education", label: "Education" },
];

const difficultyLevels: { value: DifficultyLevel; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function UserPreferences() {
  
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: () => user ? fetchUserPreferences(user.id) : Promise.reject('No user'),
    enabled: !!user,
  });
  
  const { mutate: updatePrefs, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => {
      if (!user) return Promise.reject('No user');
      return updateUserPreferences(user.id, data);
    },
    onSuccess: () => {
      toast({
        title: "Preferences updated",
        description: "Your topic preferences have been saved.",
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update preferences",
        description: String(error),
        variant: "destructive",
      });
    }
  });
  
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("intermediate");
  
  // Update form when preferences are loaded
  useEffect(() => {
    if (preferences && selectedCategories.length === 0) {
      const prefCategories = preferences.categories || [];
      
      // Filter and cast the categories to ensure they are valid Category types
      const validCategories = prefCategories.filter((cat): cat is Category => 
        categories.some(c => c.value === cat)
      );
      
      setSelectedCategories(validCategories);
      
      const diffLevel = preferences.difficulty_level;
      if (diffLevel && difficultyLevels.some(d => d.value === diffLevel)) {
        setSelectedDifficulty(diffLevel as DifficultyLevel);
      }
    }
  }, [preferences, selectedCategories.length]);
  
  const handleSavePreferences = () => {
    updatePrefs({
      categories: selectedCategories,
      difficulty_level: selectedDifficulty
    });
  };

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Settings2 className="mr-2 h-4 w-4" />
          Topic Preferences
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Topic Preferences</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Categories of Interest</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <div 
                    key={category.value} 
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.value]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category.value)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`category-${category.value}`} className="text-sm font-normal">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-xs text-destructive">Please select at least one category</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select 
                value={selectedDifficulty} 
                onValueChange={(value: string) => setSelectedDifficulty(value as DifficultyLevel)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
                <SelectContent>
                  {difficultyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSavePreferences} 
              disabled={isUpdating || selectedCategories.length === 0}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
