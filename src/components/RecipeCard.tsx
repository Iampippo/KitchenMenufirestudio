import React from 'react';
import { Clock, Heart, ShoppingBag, Plus } from 'lucide-react';
import { Recipe } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInventory } from '../contexts/InventoryContext';

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle?: (id: string) => void;
  delay?: number;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onFavoriteToggle, delay = 0 }) => {
  const navigate = useNavigate();
  const { inventory } = useInventory();
  
  // 计算缺少的食材
  const missingIngredients = recipe.missing && recipe.missing.length > 0 
    ? recipe.missing 
    : recipe.ingredients.filter(ingredient => {
        const inventoryItem = inventory.find(item => item.name === ingredient);
        return !inventoryItem || inventoryItem.amount === 0;
      });
  
  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id);
    }
  };
  
  return (
    <motion.div 
      className={`bg-white rounded-xl shadow overflow-hidden transition hover:shadow-md cursor-pointer ${
        missingIngredients.length === 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-amber-400'
      }`}
      onClick={handleRecipeClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: delay * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="flex">
        {/* 左侧图片区域 */}
        <div className="w-24 bg-gray-200 flex-shrink-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
            <span className="text-indigo-400 font-medium">{recipe.image}</span>
          </div>
        </div>
        
        {/* 右侧内容区域 */}
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800 truncate max-w-[180px]">{recipe.name}</h3>
              <span className="text-xs text-gray-500">{recipe.weight}</span>
            </div>
            <div className="flex items-center">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full mr-2">
                {recipe.difficulty}
              </span>
              <Heart 
                size={16} 
                className={recipe.favorite ? "text-red-500" : "text-gray-300"} 
                fill={recipe.favorite ? "currentColor" : "none"}
                onClick={toggleFavorite}
              />
            </div>
          </div>
          
          {/* 标签展示 */}
          <div className="flex flex-wrap gap-1 mt-1 mb-2 overflow-hidden" style={{ maxHeight: '22px' }}>
            {recipe.tags.map((tag, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          {/* 时间信息区域 */}
          <div className="bg-green-50 rounded-lg px-2 py-1 mb-2">
            <div className="flex items-center">
              <Clock size={14} className="text-green-600 mr-1 flex-shrink-0" />
              <div className="text-xs text-green-700 font-medium">
                准备{recipe.prepTime} · 烹饪{recipe.cookTime} · 共{recipe.totalTime}
              </div>
            </div>
          </div>
          
          {/* 缺少或完备的食材标签 */}
          <div className="flex items-center flex-wrap gap-1 mt-1">
            {missingIngredients.length > 0 ? (
              <>
                <span className="text-xs font-medium text-amber-600">缺少:</span>
                {missingIngredients.map((item, idx) => (
                  <span key={idx} className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-md flex items-center">
                    {item}
                    <ShoppingBag size={10} className="ml-1" />
                  </span>
                ))}
              </>
            ) : (
              <span className="text-xs font-medium px-2 py-0.5 bg-green-100 text-green-700 rounded-md">
                食材完备！
              </span>
            )}
          </div>
          
          {/* 操作按钮 */}
          <div className="mt-2 flex justify-between items-center">
            {/* 左侧显示卡路里等核心信息 */}
            <div className="text-xs text-gray-600">
              {recipe.calories}卡 · 蛋白{recipe.protein}
            </div>
            
            {/* 右侧操作按钮 */}
            <div className="flex items-center">
              <button 
                className={`${
                  missingIngredients.length === 0 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-400 text-amber-800'
                  } text-xs px-2 py-1 rounded-full flex items-center mr-1`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (missingIngredients.length === 0) {
                    navigate(`/recipe/${recipe.id}/cook`);
                  }
                }}
              >
                {missingIngredients.length === 0 ? '开始烹饪' : '查看详情'}
              </button>
              <button 
                className="bg-gray-200 text-gray-600 p-1 rounded-full flex-shrink-0 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to planned meals
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;