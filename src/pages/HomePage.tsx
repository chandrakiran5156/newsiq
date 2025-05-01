
import { useState, useCallback } from 'react';
import ArticleCard from '@/components/articles/ArticleCard';
import CategoryFilters from '@/components/articles/CategoryFilters';
import { mockArticles } from '@/data/mockData';
import { Category } from '@/types';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCategorySelect = useCallback((categoryId: Category | null) => {
    setSelectedCategory(categoryId);
  }, []);

  const filteredArticles = selectedCategory
    ? mockArticles.filter(article => article.category === selectedCategory)
    : mockArticles;

  return (
    <div>
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Today's Picks</h2>
        <CategoryFilters 
          onSelectCategory={handleCategorySelect} 
          selectedCategory={selectedCategory} 
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
}
