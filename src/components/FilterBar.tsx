import React from 'react';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  showCookable?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect,
  showCookable = true
}) => {
  return (
    <motion.div 
      className="bg-white px-4 py-3 border-t border-gray-100 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar">
          <button 
            className={`${selectedCategory === "all" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600"} px-3 py-1 rounded-full text-xs whitespace-nowrap transition duration-200`}
            onClick={() => onCategorySelect("all")}
          >
            全部菜谱
          </button>
          
          {categories.map((cat) => (
            <button 
              key={cat.id} 
              className={`${selectedCategory === cat.name 
                ? `${cat.color.split(' ')[1].replace('text', 'bg')} text-white` 
                : `${cat.color}`} px-3 py-1 rounded-full text-xs whitespace-nowrap transition duration-200`}
              onClick={() => onCategorySelect(cat.name)}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
          
          {showCookable && (
            <>
              <button 
                className={`${selectedCategory === "cookable" ? "bg-green-500 text-white" : "bg-green-100 text-green-600"} px-3 py-1 rounded-full text-xs whitespace-nowrap transition duration-200`}
                onClick={() => onCategorySelect("cookable")}
              >
                可直接制作
              </button>
              <button 
                className={`${selectedCategory === "missing" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-600"} px-3 py-1 rounded-full text-xs whitespace-nowrap transition duration-200`}
                onClick={() => onCategorySelect("missing")}
              >
                缺少食材
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;