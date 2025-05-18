import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import InventoryDisplay from '../components/InventoryDisplay';
import UserStatsCard from '../components/UserStatsCard';
import RecipeCard from '../components/RecipeCard';
import CategoryGrid from '../components/CategoryGrid';
import CookingTip from '../components/CookingTip';
import BottomNavigation from '../components/BottomNavigation';
import { categoriesData, userStatsData } from '../data/mockData';
import { Recipe } from '../types';
import { useInventory } from '../contexts/InventoryContext';
import { useAuth } from '../contexts/AuthContext';
import { getAllRecipes, toggleFavorite, getRecommendedRecipes, calculateMissingIngredients } from '../services/recipeService';
import { getUserIngredientNames } from '../services/ingredientService';
import { toast } from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { inventory } = useInventory();
  const { user } = useAuth();

  // 获取菜谱数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("开始获取菜谱数据，用户状态:", user ? "已登录" : "未登录");
        let fetchedRecipes: Recipe[] = [];
        
        if (user) {
          // 获取用户库存中的食材名称
          const userIngredients = await getUserIngredientNames(user.id);
          console.log("获取到用户库存食材:", userIngredients);
          
          if (userIngredients && userIngredients.length > 0) {
            // 获取推荐菜谱（根据用户库存）
            console.log("开始获取推荐菜谱");
            fetchedRecipes = await getRecommendedRecipes(userIngredients);
            console.log("获取到推荐菜谱数量:", fetchedRecipes.length);
          } else {
            console.log("用户库存为空，获取所有菜谱");
            fetchedRecipes = await getAllRecipes();
          }
          
          if (!fetchedRecipes || fetchedRecipes.length === 0) {
            // 如果API没有返回菜谱，使用mockData
            console.log("API没有返回菜谱，使用本地数据");
            const localRecipes = await getAllRecipes();
            if (localRecipes && localRecipes.length > 0) {
              fetchedRecipes = localRecipes;
              // 计算缺失食材
              if (userIngredients && userIngredients.length > 0) {
                fetchedRecipes = fetchedRecipes.map(recipe => ({
                  ...recipe,
                  missing: calculateMissingIngredients(recipe, userIngredients)
                }));
              }
              toast.success(`找到${fetchedRecipes.length}个菜谱`);
            }
          }
        } else {
          // 未登录时使用本地获取的菜谱
          console.log("用户未登录，从API获取所有菜谱");
          fetchedRecipes = await getAllRecipes();
        }
        
        console.log("设置菜谱数据:", fetchedRecipes);
        setRecipes(fetchedRecipes);
        // 初始化时设置过滤后的菜谱为全部菜谱
        setFilteredRecipes(fetchedRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // 获取所有菜谱作为备用
        console.log("发生错误，尝试获取所有菜谱");
        try {
          const allRecipes = await getAllRecipes();
          if (allRecipes && allRecipes.length > 0) {
            setRecipes(allRecipes);
            setFilteredRecipes(allRecipes);
            toast.success(`找到${allRecipes.length}个菜谱`);
          }
        } catch (secondError) {
          console.error('Error fetching all recipes:', secondError);
          toast.error("获取菜谱失败");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, inventory]);

  // 处理搜索和过滤
  useEffect(() => {
    if (recipes.length === 0) return;
    
    console.log("处理搜索和过滤，菜谱总数:", recipes.length);
    let results = [...recipes]; // 创建副本避免直接修改
    
    // 应用搜索过滤
    if (searchTerm) {
      results = results.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 应用分类过滤
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'cookable') {
        results = results.filter(recipe => {
          // 确保missing属性存在并且长度为0
          return recipe.missing && recipe.missing.length === 0;
        });
      } else if (selectedCategory === 'missing') {
        results = results.filter(recipe => {
          // 确保missing属性存在并且长度大于0
          return recipe.missing && recipe.missing.length > 0;
        });
      } else {
        results = results.filter(recipe => recipe.tags.includes(selectedCategory));
      }
    }
    
    console.log("过滤后的菜谱数量:", results.length);
    setFilteredRecipes(results);
  }, [searchTerm, selectedCategory, recipes]);

  // 实时计算每个菜谱的缺失食材（用户库存变化时重新计算）
  useEffect(() => {
    if (recipes.length === 0 || !inventory.length) return;
    
    console.log("库存变化，重新计算缺失食材");
    const ingredientNames = inventory.map(item => item.name);
    
    const updatedRecipes = recipes.map(recipe => {
      const missingIngredients = calculateMissingIngredients(recipe, ingredientNames);
      return { ...recipe, missing: missingIngredients };
    });
    
    console.log("更新后的菜谱:", updatedRecipes);
    setRecipes(updatedRecipes);
  }, [inventory]);

  // 切换收藏状态
  const handleFavoriteToggle = async (id: string) => {
    if (!user) {
      toast.error("请先登录再收藏菜谱");
      return;
    }
    
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;
    
    const newFavoriteStatus = !recipe.favorite;
    
    // 调用API更新收藏状态
    const success = await toggleFavorite(id, newFavoriteStatus);
    
    if (success) {
      // 更新本地状态
      const updatedRecipes = recipes.map(recipe => 
        recipe.id === id ? { ...recipe, favorite: newFavoriteStatus } : recipe
      );
      setRecipes(updatedRecipes);
      toast.success(newFavoriteStatus ? "已添加到收藏" : "已从收藏中移除");
    } else {
      toast.error("更新收藏状态失败");
    }
  };

  // 渲染组件
  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      {/* Header */}
      <Header 
        title="厨房小帮手" 
        showFilter={true}
        onFilterToggle={() => setShowFilterBar(!showFilterBar)}
      />
      
      {/* Search Bar */}
      <SearchBar 
        placeholder="搜索菜谱或食材..."
        onSearch={(value) => setSearchTerm(value)}
      />
      
      {/* Filter Bar */}
      {showFilterBar && (
        <FilterBar 
          categories={categoriesData}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      )}
      
      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4 pb-20">
        {/* User Stats Card */}
        <UserStatsCard stats={userStatsData} />
        
        {/* Inventory Display */}
        <InventoryDisplay />
        
        {/* Today's Recommendations */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">今日推荐料理</h2>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-1">根据您的库存</span>
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Recipe Cards */}
        {!loading && filteredRecipes.length > 0 && (
          <div className="space-y-4 mb-6">
            {filteredRecipes.map((recipe, index) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onFavoriteToggle={handleFavoriteToggle}
                delay={index}
              />
            ))}
          </div>
        )}
        
        {/* No Results Message */}
        {!loading && filteredRecipes.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl shadow-sm mb-6">
            <div className="text-gray-500">没有找到推荐菜谱，请添加更多食材到库存</div>
          </div>
        )}
        
        {/* Category Grid */}
        <CategoryGrid 
          categories={categoriesData} 
          onCategorySelect={setSelectedCategory}
        />
        
        {/* Cooking Tip */}
        <CookingTip 
          title="料理小技巧" 
          content="尝试组合不同食材可能会发现意想不到的美味! 探索新的食材搭配来解锁特殊料理。"
        />
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default HomePage;