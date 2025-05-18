import React, { useState, useMemo, Fragment } from 'react';
import { Plus, Search, Edit3, Check, AlertTriangle, BarChart2, CheckCircle, X } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useInventory } from '../contexts/InventoryContext';
import { motion } from 'framer-motion';
import { recipesData } from '../data/mockData';
import { ingredientCategories, ingredientFrequency, ingredientPairings } from '../data/ingredientCategories';
import { Dialog, Transition } from '@headlessui/react';

// 更新食材分类
const categories = [
  { id: 'vegetables', name: '蔬菜', color: 'bg-green-100 text-green-600' },
  { id: 'meat', name: '肉类', color: 'bg-red-100 text-red-600' },
  { id: 'seafood', name: '海鲜', color: 'bg-blue-100 text-blue-600' },
  { id: 'seasoning', name: '调味料', color: 'bg-amber-100 text-amber-600' },
  { id: 'staple', name: '主食', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'mushroom', name: '菌菇', color: 'bg-gray-100 text-gray-600' },
  { id: 'bean', name: '豆制品', color: 'bg-yellow-50 text-yellow-700' },
  { id: 'egg', name: '蛋类', color: 'bg-yellow-200 text-yellow-800' },
  { id: 'others', name: '其他', color: 'bg-gray-100 text-gray-600' }
];

const InventoryPage: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientAmount, setNewIngredientAmount] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { inventory, availableIngredients, deleteIngredient, updateIngredientAmount, addIngredient, isLoading, initializeData } = useInventory();

  // 获取所有菜谱中使用的食材
  const recipeIngredients = useMemo(() => {
    const ingredients = new Set<string>();
    recipesData.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredients.add(ingredient);
      });
    });
    return Array.from(ingredients);
  }, []);

  // 获取热门食材（在多个菜谱中使用的食材）
  const popularIngredients = useMemo(() => {
    const ingredientCount = new Map<string, number>();
    recipesData.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        ingredientCount.set(ingredient, (ingredientCount.get(ingredient) || 0) + 1);
      });
    });
    return Array.from(ingredientCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);
  }, []);

  // 获取缺失的食材（菜谱中用到但库存中没有的）
  const missingIngredients = useMemo(() => {
    return recipeIngredients.filter(ingredient => 
      !inventory.some(item => item.name === ingredient)
    );
  }, [inventory, recipeIngredients]);

  // 获取推荐添加的食材
  const getRecommendedIngredients = () => {
    // 优先推荐缺失的热门食材
    const recommended = popularIngredients
      .filter(ingredient => missingIngredients.includes(ingredient))
      .slice(0, 8);

    return recommended.map(name => {
      const ingredient = availableIngredients.find(i => i.name === name);
      if (!ingredient) return null;

      // 获取食材的使用频率
      const frequency = ingredientFrequency[name as keyof typeof ingredientFrequency] || 0;
      
      // 获取食材的搭配建议
      const pairings = ingredientPairings[name as keyof typeof ingredientPairings] || [];
      
      // 找到库存中已有的搭配食材
      const availablePairings = pairings.filter((pairing: string) => 
        inventory.some(item => item.name === pairing)
      );

      return {
        ...ingredient,
        frequency,
        pairings: availablePairings
      };
    }).filter(Boolean);
  };

  // 根据搜索词和分类过滤库存
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'all') return matchesSearch;
    
    // 根据分类过滤
    const categoryIngredients = Object.entries(ingredientCategories).find(
      ([category]) => category === selectedCategory
    );
    return matchesSearch && categoryIngredients?.[1].includes(item.name);
  });

  // 获取状态数量统计
  const getStatusCount = (status: string) => {
    return inventory.filter(item => {
      if (status === 'depleted') return item.amount === 0;
      if (status === 'warning') return item.amount <= 2 && item.amount > 0;
      if (status === 'good') return item.amount > 2;
      return false;
    }).length;
  };

  // 获取可制作的菜谱
  const cookableRecipes = useMemo(() => {
    return recipesData.filter(recipe => {
      const missingIngredients = recipe.ingredients.filter(ingredient => {
        const inventoryItem = inventory.find(item => item.name === ingredient);
        return !inventoryItem || inventoryItem.amount === 0;
      });
      return missingIngredients.length === 0;
    });
  }, [inventory]);

  // 获取状态样式
  const getStatusStyle = (amount: number) => {
    if (amount === 0) {
      return { color: 'text-gray-400', bgColor: 'bg-gray-100', icon: <AlertTriangle size={14} className="text-gray-400" /> };
    } else if (amount <= 2) {
      return { color: 'text-amber-500', bgColor: 'bg-amber-50', icon: <AlertTriangle size={14} className="text-amber-500" /> };
    } else {
      return { color: 'text-green-500', bgColor: 'bg-green-50', icon: <CheckCircle size={14} className="text-green-500" /> };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header 
        title="食材库存" 
        showFilter={true}
        onFilterToggle={() => setShowFilter(!showFilter)}
      />

      {/* Search Bar */}
      <div className="bg-gray-100 px-4 py-2">
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <input
              type="text"
              placeholder="搜索食材..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* 添加初始化按钮 */}
          <div className="flex justify-center mt-2">
            <button
              onClick={() => {
                if (window.confirm('确定要初始化系统食材数据吗？这将向数据库中添加默认食材。')) {
                  initializeData();
                }
              }}
              className="px-4 py-1 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 transition-colors"
            >
              初始化系统食材数据
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white px-4 py-2 border-t border-gray-100">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar">
            <button
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setSelectedCategory('all')}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category.id
                    ? category.color.replace('100', '500').replace('text-', 'text-white')
                    : category.color
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-4">
          <button 
            className="text-sm text-indigo-600 flex items-center"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <>
                <Check size={16} className="mr-1" />
                完成编辑
              </>
            ) : (
              <>
                <Edit3 size={16} className="mr-1" />
                编辑库存
              </>
            )}
          </button>
          
          {/* 添加食材按钮 */}
          {editMode && (
            <button
              className="ml-2 bg-indigo-600 text-white text-sm rounded-md px-3 py-1 flex items-center"
              onClick={() => {
                setNewIngredientName('');
                setNewIngredientAmount(1);
                setShowAddModal(true);
              }}
            >
              <Plus size={16} className="mr-1" />
              添加食材
            </button>
          )}
        </div>

        {/* 库存状态卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-medium text-gray-700">库存状态</h2>
            <button className="text-xs text-indigo-600 flex items-center">
              <BarChart2 size={14} className="mr-1" />
              更多统计
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-green-600 text-xl font-bold">{getStatusCount('good')}</span>
              <span className="text-green-600 text-xs mt-1">库存充足</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 flex flex-col items-center">
              <span className="text-amber-600 text-xl font-bold">{getStatusCount('warning')}</span>
              <span className="text-amber-600 text-xs mt-1">库存不足</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 flex flex-col items-center">
              <span className="text-gray-600 text-xl font-bold">{getStatusCount('depleted')}</span>
              <span className="text-gray-600 text-xs mt-1">需补充</span>
            </div>
          </div>
        </div>

        {/* 可制作菜谱卡片 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-medium text-gray-700">当前可制作</h2>
            <button className="text-xs text-indigo-600">
              查看全部 ({cookableRecipes.length}/{recipesData.length})
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
            {cookableRecipes.map(recipe => (
              <div key={recipe.id} className="min-w-36 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                <div className="h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-400 font-medium">{recipe.image}</span>
                </div>
                <div className="p-2">
                  <div className="text-sm font-medium text-gray-800">{recipe.name}</div>
                  <div className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    食材齐全
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Ingredients Section */}
        {!editMode && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">推荐添加</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {getRecommendedIngredients().map((ingredient) => (
                ingredient && (
                  <motion.button
                    key={ingredient.name}
                    className="p-3 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
                    onClick={() => addIngredient(ingredient.name, 1)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 ${ingredient.color} rounded-lg flex items-center justify-center text-white font-medium`}>
                      {ingredient.name[0]}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{ingredient.name}</div>
                      <div className="text-xs text-gray-500">使用频率: {ingredient.frequency}次</div>
                      {ingredient.pairings.length > 0 && (
                        <div className="text-xs text-indigo-600 mt-1">
                          可搭配: {ingredient.pairings.join(', ')}
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              ))}
            </div>
          </div>
        )}

        {/* Current Inventory */}
        <h2 className="text-lg font-semibold text-gray-800 mb-3">当前库存</h2>
        <div className="space-y-3">
          {filteredInventory.map((item, index) => {
            const status = getStatusStyle(item.amount);
            const usedInRecipes = recipesData.filter(recipe => 
              recipe.ingredients.includes(item.name)
            );
            
            return (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl p-3 shadow-sm flex items-center justify-between"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center flex-1">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <div className={`text-xs ${status.color} ${status.bgColor} px-2 py-0.5 rounded-full ml-2 flex items-center`}>
                        {status.icon}
                        <span className="ml-1">{item.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 编辑模式下显示数量调整按钮和删除按钮 */}
                {editMode && (
                  <div className="flex items-center">
                    <button
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-1"
                      onClick={() => updateIngredientAmount(item.id, -1)}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.amount}</span>
                    <button
                      className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 mr-2"
                      onClick={() => updateIngredientAmount(item.id, 1)}
                    >
                      +
                    </button>
                    <button
                      className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-500"
                      onClick={() => {
                        if (window.confirm(`确定要删除 ${item.name} 吗?`)) {
                          deleteIngredient(item.id);
                        }
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      <BottomNavigation />

      {/* 添加食材弹窗 */}
      <Transition appear show={showAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={()=>setShowAddModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">添加食材</Dialog.Title>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">选择食材</label>
                    <input
                      list="ingredientOptions"
                      value={newIngredientName}
                      onChange={(e)=>setNewIngredientName(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="搜索并选择食材名称"
                    />
                    <datalist id="ingredientOptions">
                      {availableIngredients.map(i=>(<option key={i.id} value={i.name} />))}
                    </datalist>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-700 mb-1">数量</label>
                    <input type="number" min={1} value={newIngredientAmount} onChange={(e)=>setNewIngredientAmount(parseInt(e.target.value,10))} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={()=>setShowAddModal(false)} className="px-4 py-2 bg-gray-100 rounded-md text-gray-600">取消</button>
                    <button onClick={()=>{
                      if(newIngredientName){
                        addIngredient(newIngredientName,newIngredientAmount);
                        setShowAddModal(false);
                      }
                    }} className="px-4 py-2 bg-indigo-600 text-white rounded-md">添加</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default InventoryPage;