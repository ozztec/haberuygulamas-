import React from 'react';
import { Category } from '../types';
import { CATEGORIES } from '../constants';

interface CategoryFilterProps {
  selectedCategory: Category | 'all' | 'liked';
  onSelectCategory: (category: Category | 'all' | 'liked') => void;
}

const allCategories = ['all' as const, 'liked' as const, ...CATEGORIES];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => {
        const isActive = selectedCategory === category;
        let text: string;
        if (category === 'all') {
            text = 'Tümü';
        } else if (category === 'liked') {
            text = 'Beğenilenler ❤️';
        } else {
            text = category;
        }

        return (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500
              ${isActive
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
};