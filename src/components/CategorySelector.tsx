"use client";

import { useState } from 'react';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'study', label: 'Study', icon: '📚', color: 'bg-purple-200 text-purple-800' },
  { id: 'work', label: 'Work', icon: '💼', color: 'bg-blue-200 text-blue-800' },
  { id: 'social', label: 'Social', icon: '👥', color: 'bg-pink-200 text-pink-800' },
  { id: 'rest', label: 'Rest', icon: '😴', color: 'bg-indigo-200 text-indigo-800' },
  { id: 'other', label: 'Other', icon: '⭐', color: 'bg-gray-200 text-gray-800' },
];

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-focus0x text-white scale-105 shadow-lg'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <span className="mr-1">{category.icon}</span>
          {category.label}
        </button>
      ))}
    </div>
  );
}
