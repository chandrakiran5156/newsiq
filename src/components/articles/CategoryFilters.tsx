
import { useState, useEffect } from 'react';
import { categories } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/lib/supabase-auth';
import { useQuery } from '@tanstack/react-query';
import { fetchUserPreferences } from '@/lib/api';

interface CategoryFiltersProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  filterByUserPreferences?: boolean;
}

export default function CategoryFilters({ 
  onSelectCategory, 
  selectedCategory,
  filterByUserPreferences = false
}: CategoryFiltersProps) {
  const { user } = useAuth();
  const [userCategories, setUserCategories] = useState<string[]>([]);
  
  // Fetch user preferences to get selected categories
  const { data: preferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: () => user ? fetchUserPreferences(user.id) : Promise.reject('No user'),
    enabled: !!user && filterByUserPreferences,
  });
  
  // Update categories when preferences change
  useEffect(() => {
    if (preferences && filterByUserPreferences) {
      setUserCategories(preferences.categories || []);
    }
  }, [preferences, filterByUserPreferences]);
  
  // Filter categories to show only user-selected ones if needed
  const displayedCategories = filterByUserPreferences && userCategories.length > 0
    ? categories.filter(cat => userCategories.includes(cat.id))
    : categories;

  return (
    <div className="mb-4">
      <ScrollArea className="pb-2">
        <div className="flex space-x-2 pb-1 px-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          {displayedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition flex items-center ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <span className="mr-1">{category.icon}</span> {category.name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
