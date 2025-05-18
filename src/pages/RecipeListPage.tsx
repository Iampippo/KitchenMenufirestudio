import React, { useState } from 'react';
import { Search, Filter, Star, Clock, ChevronDown, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const RecipeListPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFilter, setShowFilter] = useState(false);
  
  // 菜谱分类
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'quick', name: '快手菜', color: 'bg-red-100 text-red-600' },
    { id: 'lowcal', name: '低卡饮食', color: 'bg-blue-100 text-blue-600' },
    { id: 'balanced', name: '营养均衡', color: 'bg-yellow-100 text-yellow-600' },
    { id: 'protein', name: '高蛋白', color: 'bg-purple-100 text-purple-600' },
    { id: 'vegetarian', name: '素食', color: 'bg-green-100 text-green-600' },
    { id: 'seafood', name: '海鲜', color: 'bg-cyan-100 text-cyan-600' }
  ];
  
  // 筛选选项
  const filterOptions = [
    { id: 'cookable', name: '当前可做', icon: '✓' },
    { id: 'time_under_15', name: '15分钟内', icon: '⏱' },
    { id: 'favorite', name: '我的收藏', icon: '♥' },
    { id: 'rating', name: '评分最高', icon: '★' }
  ];
  
  // 示例菜谱数据
  const recipes = [
    {
      id: 1,
      name: '西红柿炒鸡蛋',
      image: 'tomato-egg',
      time: '10分钟',
      difficulty: '简单',
      calories: 220,
      rating: 4.8,
      reviews: 128,
      canCook: true,
      favorite: true,
      categories: ['quick', 'balanced']
    },
    {
      id: 2,
      name: '香煎三文鱼',
      image: 'salmon',
      time: '15分钟',
      difficulty: '中等',
      calories: 350,
      rating: 4.9,
      reviews: 86,
      canCook: false,
      missing: ['三文鱼'],
      favorite: true,
      categories: ['protein', 'seafood']
    },
    // ... (previous recipe data remains the same)
  ];
  
  // 根据当前选择的分类筛选菜谱
  const filteredRecipes = recipes.filter(recipe => {
    if (activeCategory === 'all') return true;
    return recipe.categories.includes(activeCategory);
  });
  
  // 切换收藏状态
  const toggleFavorite = (recipeId: number) => {
    // 实际应用中这里会调用API更新收藏状态
    console.log(`Toggle favorite for recipe ${recipeId}`);
  };
  
  // 添加食材到购物清单
  const addToShoppingList = (items: string[]) => {
    // 实际应用中这里会调用API添加到购物清单
    console.log(`Add ${items.join(', ')} to shopping list`);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      <Header 
        title="菜谱" 
        showFilter={true}
        onFilterToggle={() => setShowFilter(!showFilter)}
      />
      
      {/* 搜索栏 */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="搜索菜谱、食材或标签..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>
      </div>
      
      {/* 筛选选项 - 可折叠 */}
      {showFilter && (
        <div className="bg-white px-4 py-3 border-t border-gray-100 shadow-sm">
          <div className="w-full max-w-3xl mx-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">筛选</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <span className="mr-1">{option.icon}</span>
                  {option.name}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <h3 className="text-sm font-medium text-gray-700">排序方式</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>推荐优先</span>
                <ChevronDown size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 分类标签 */}
      <div className="bg-white px-4 py-2 border-t border-gray-100">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? category.id === 'all'
                      ? 'bg-indigo-500 text-white'
                      : category.color
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 主内容区 */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* 菜谱网格 */}
        <div className="grid grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              {/* 菜谱图片 */}
              <div className="relative h-36 bg-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-400 font-medium">{recipe.image}</span>
                </div>
                
                {/* 收藏按钮 */}
                <button 
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                >
                  <Heart
                    size={18}
                    className={recipe.favorite ? "text-red-500" : "text-gray-400"}
                    fill={recipe.favorite ? "currentColor" : "none"}
                  />
                </button>
                
                {/* 可做状态标签 */}
                <div className="absolute bottom-2 left-2">
                  <div className={`px-2 py-0.5 rounded-full text-xs ${
                    recipe.canCook
                      ? 'bg-green-500 text-white'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {recipe.canCook ? '可以做' : '缺少食材'}
                  </div>
                </div>
              </div>
              
              {/* 菜谱信息 */}
              <div className="p-3">
                <h3 className="font-medium text-gray-800 mb-1">{recipe.name}</h3>
                
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <Clock size={12} className="mr-1" />
                  <span>{recipe.time}</span>
                  <span className="mx-1">•</span>
                  <span>{recipe.calories} 卡路里</span>
                  <span className="mx-1">•</span>
                  <span>{recipe.difficulty}</span>
                </div>
                
                {/* 评分 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-xs ml-1 text-gray-600">{recipe.rating} ({recipe.reviews})</span>
                  </div>
                  
                  {/* 如果缺少食材，显示"添加到购物清单"按钮 */}
                  {!recipe.canCook && recipe.missing && (
                    <button 
                      className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToShoppingList(recipe.missing);
                      }}
                    >
                      <Plus size={12} className="mr-1" />
                      <span>购物清单</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default RecipeListPage;