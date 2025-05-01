
import { useState } from 'react';
import { categories } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CategoryFiltersProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
}

export default function CategoryFilters({ onSelectCategory, selectedCategory }: CategoryFiltersProps) {
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
          {categories.map((category) => (
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
