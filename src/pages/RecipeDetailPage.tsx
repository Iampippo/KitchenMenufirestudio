import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Heart, ShoppingBag, Share2, ChevronDown, Check, Plus, Award } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Recipe } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipeById, toggleFavorite as toggleFavoriteAPI, completeRecipe } from '../services/recipeService';
import { addMultipleShoppingListItems } from '../services/shoppingListService';
import { getUserIngredientNames } from '../services/ingredientService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [expanded, setExpanded] = useState({
    ingredients: true,
    steps: true,
    nutrition: false,
    tips: false
  });
  const [favorite, setFavorite] = useState(false);
  const [addedToShoppingList, setAddedToShoppingList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recipeComplete, setRecipeComplete] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      
      setLoading(true);
      try {
        // 获取菜谱详情
        const fetchedRecipe = await getRecipeById(id);

        if (fetchedRecipe) {
          // 如果用户已登录，获取用户库存计算缺失食材
          if (user) {
            const userIngredients = await getUserIngredientNames(user.id);
            const missingIngredients = fetchedRecipe.ingredients.filter(
              ingredient => !userIngredients.includes(ingredient)
            );
            
            // 更新菜谱中的缺失食材列表
            fetchedRecipe.missing = missingIngredients;
          }
          
          setRecipe(fetchedRecipe);
          setFavorite(fetchedRecipe.favorite);
        } else {
          // 如果没有找到菜谱，返回首页
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error('获取菜谱详情失败');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate, user]);

  // Toggle section expand/collapse
  const toggleSection = (section: keyof typeof expanded) => {
    setExpanded({
      ...expanded,
      [section]: !expanded[section]
    });
  };

  // Add missing ingredients to shopping list
  const addToShoppingList = async () => {
    if (!user || !recipe) return;
    
    try {
      setAddedToShoppingList(true);
      
      // 准备购物清单项
      const shoppingItems = recipe.missing.map(ingredient => ({
        name: ingredient,
        quantity: '适量'
      }));
      
      // 调用服务添加到购物清单
      await addMultipleShoppingListItems(user.id, shoppingItems);
      
      toast.success('已添加缺少食材到购物清单');
    } catch (error) {
      console.error('Error adding items to shopping list:', error);
      toast.error('添加到购物清单失败');
    } finally {
      // 2秒后重置按钮状态
      setTimeout(() => {
        setAddedToShoppingList(false);
      }, 2000);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!user || !recipe) return;
    
    try {
      const newFavoriteStatus = !favorite;
      const success = await toggleFavoriteAPI(recipe.id, newFavoriteStatus);
      
      if (success) {
        setFavorite(newFavoriteStatus);
        toast.success(newFavoriteStatus ? '已添加到收藏' : '已从收藏中移除');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('更新收藏状态失败');
    }
  };

  // 标记菜谱为已完成
  const markAsComplete = async () => {
    if (!user || !recipe) return;
    
    try {
      const success = await completeRecipe(user.id);
      
      if (success) {
        setRecipeComplete(true);
        toast.success('恭喜完成料理！获得经验值奖励');
      }
    } catch (error) {
      console.error('Error marking recipe as complete:', error);
      toast.error('更新完成状态失败');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!recipe) return (
    <div className="p-4 text-center">
      <div>未找到菜谱</div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={() => navigate('/')}
      >
        返回首页
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      {/* Header */}
      <Header 
        title="菜谱详情" 
        isDetailPage={true}
        isFavorite={favorite}
        onBackClick={() => navigate(-1)}
        onFavoriteToggle={toggleFavorite}
      />
      
      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* Recipe Header */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-48 bg-gray-200 w-full relative">
            {/* Recipe Image Placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-red-200 flex items-center justify-center">
              <span className="text-red-400 font-medium text-xl">{recipe.image}</span>
            </div>
            
            <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm flex items-center">
              <Clock size={12} className="mr-1" />
              {recipe.totalTime}
            </div>
          </div>
          
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">{recipe.name}</h2>
            <div className="flex items-center mt-1 mb-2">
              <div className="flex items-center text-yellow-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(recipe.rating) ? "text-yellow-400" : "text-gray-300"}>★</span>
                ))}
                <span className="text-xs text-gray-600 ml-1">{recipe.rating}</span>
              </div>
              <span className="text-xs text-gray-500">({recipe.reviewCount}人评价)</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {recipe.difficulty}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Quick Info Bar */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border-r border-gray-100">
              <div className="text-xs text-gray-500">准备时间</div>
              <div className="font-medium text-gray-800">{recipe.prepTime}</div>
            </div>
            <div className="border-r border-gray-100">
              <div className="text-xs text-gray-500">烹饪时间</div>
              <div className="font-medium text-gray-800">{recipe.cookTime}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">存放</div>
              <div className="font-medium text-gray-800">{recipe.storage}</div>
            </div>
          </div>
        </motion.div>
        
        {/* Ingredients Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection('ingredients')}
          >
            <h3 className="text-lg font-semibold text-gray-800">食材清单</h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-500 transform transition-transform ${expanded.ingredients ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <AnimatePresence>
            {expanded.ingredients && (
              <motion.div 
                className="p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, idx) => {
                    const haveIngredient = !recipe.missing.includes(ingredient);
                    return (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center p-2 rounded-lg ${
                          haveIngredient ? 'bg-green-50' : 'bg-amber-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            haveIngredient ? 'bg-green-500' : 'bg-amber-500'
                          }`}></div>
                          <span className="text-gray-800">{ingredient}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">适量</span>
                          {!haveIngredient && (
                            <button className="text-amber-600 text-xs bg-amber-100 px-2 py-0.5 rounded flex items-center">
                              <ShoppingBag size={10} className="mr-1" />
                              添加
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {recipe.missing.length > 0 && (
                  <button 
                    className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center ${
                      addedToShoppingList
                        ? 'bg-green-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                    onClick={addToShoppingList}
                    disabled={addedToShoppingList}
                  >
                    {addedToShoppingList 
                      ? <><Check size={16} className="mr-1" /> 已添加到购物清单</>
                      : <><ShoppingBag size={16} className="mr-1" /> 添加缺少食材到购物清单</>
                    }
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Cooking Steps Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection('steps')}
          >
            <h3 className="text-lg font-semibold text-gray-800">烹饪步骤</h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-500 transform transition-transform ${expanded.steps ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <AnimatePresence>
            {expanded.steps && (
              <motion.div 
                className="p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {recipe.steps.map((step, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                    >
                      <div className="mr-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 mb-1">{step.description}</p>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {step.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Nutrition Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection('nutrition')}
          >
            <h3 className="text-lg font-semibold text-gray-800">营养成分</h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-500 transform transition-transform ${expanded.nutrition ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <AnimatePresence>
            {expanded.nutrition && (
              <motion.div 
                className="p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">热量</div>
                    <div className="text-xl font-semibold text-gray-800">{recipe.calories}<span className="text-sm">卡</span></div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">蛋白质</div>
                    <div className="text-xl font-semibold text-gray-800">{recipe.protein}</div>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <div className="text-sm text-amber-600 font-medium">脂肪</div>
                    <div className="text-xl font-semibold text-gray-800">{recipe.fat}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">碳水化合物</div>
                    <div className="text-xl font-semibold text-gray-800">{recipe.carbs}</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700">维生素</div>
                  <div className="text-sm text-gray-600 mt-1">{recipe.vitamins}</div>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-700">矿物质</div>
                  <div className="text-sm text-gray-600 mt-1">{recipe.minerals}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Tips Section */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer border-b border-gray-100"
            onClick={() => toggleSection('tips')}
          >
            <h3 className="text-lg font-semibold text-gray-800">小贴士和搭配建议</h3>
            <ChevronDown 
              size={18} 
              className={`text-gray-500 transform transition-transform ${expanded.tips ? 'rotate-180' : ''}`} 
            />
          </div>
          
          <AnimatePresence>
            {expanded.tips && (
              <motion.div 
                className="p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">烹饪小贴士</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {recipe.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600">{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">推荐搭配</h4>
                  <div className="flex flex-wrap gap-2">
                    {recipe.pairings.map((item, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Achievement Card */}
        <motion.div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 shadow-sm text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start">
            <div className="mr-3">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-medium mb-1">完成此菜谱可获得</h3>
              <p className="text-sm text-white/90">10点经验值 + "家常料理"成就进度</p>
            </div>
          </div>
        </motion.div>
        
        {/* Related Recipes */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">相关菜谱推荐</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-24 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <span className="text-red-400">番茄蛋花汤</span>
              </div>
              <div className="p-2">
                <h4 className="font-medium text-gray-800 truncate">番茄蛋花汤</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">15分钟</span>
                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">可做</span>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-24 bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <span className="text-yellow-600">家常炒鸡蛋</span>
              </div>
              <div className="p-2">
                <h4 className="font-medium text-gray-800 truncate">家常炒鸡蛋</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">10分钟</span>
                  <span className="text-xs bg-green-100 text-green-700 px-1 rounded">可做</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* 完成烹饪按钮 */}
        {!recipeComplete && (
          <motion.div
            className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-white shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              onClick={markAsComplete}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-medium flex items-center justify-center"
            >
              <Award size={18} className="mr-2" />
              完成烹饪 (+50经验值)
            </button>
          </motion.div>
        )}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default RecipeDetailPage;