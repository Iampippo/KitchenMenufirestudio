import React from 'react';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryGridProps {
  categories: Category[];
  onCategorySelect: (categoryName: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, onCategorySelect }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">热门分类</h2>
      <div className="grid grid-cols-4 gap-2">
        {categories.map((cat, idx) => (
          <motion.div 
            key={cat.id} 
            className="text-center cursor-pointer"
            onClick={() => onCategorySelect(cat.name)}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className={`${cat.color.split(' ')[0]} rounded-lg p-3 mb-1`}>
              <div className="w-12 h-12 mx-auto flex items-center justify-center">
                <span className={cat.color.split(' ')[1]}>{cat.count}</span>
              </div>
            </div>
            <p className="text-xs">{cat.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;