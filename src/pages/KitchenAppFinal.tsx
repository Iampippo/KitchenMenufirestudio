import React, { useState } from 'react';
import { Search, Plus, Clock, ChevronRight, Heart, RefreshCw, ShoppingBag, Book, User, Calendar, List, Filter, Award } from 'lucide-react';

const KitchenAppFinal = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showFilterBar, setShowFilterBar] = useState(false);
  
  const inventory = [
    { name: '西红柿', color: 'bg-red-400', amount: 4 },
    { name: '鸡蛋', color: 'bg-yellow-200', amount: 8 },
    { name: '虾仁', color: 'bg-orange-300', amount: 2 },
    { name: '土豆', color: 'bg-yellow-600', amount: 5 },
    { name: '洋葱', color: 'bg-purple-300', amount: 3 },
    { name: '大蒜', color: 'bg-gray-200', amount: 10 },
    { name: '油', color: 'bg-yellow-400', amount: 12 },
    { name: '盐', color: 'bg-gray-100', amount: 15 },
    { name: '胡椒', color: 'bg-gray-400', amount: 7 },
    { name: '葱', color: 'bg-green-400', amount: 6 },
    { name: '姜', color: 'bg-yellow-700', amount: 4 },
    { name: '花生油', color: 'bg-yellow-500', amount: 9 }
  ];
  
  const recipes = [
    {
      name: '西红柿炒鸡蛋',
      weight: '300g',
      ingredients: ['西红柿', '鸡蛋', '油', '盐', '大蒜'],
      missing: [],
      prepTime: '5分钟',
      cookTime: '5分钟',
      totalTime: '10分钟',
      storage: '冷藏1天',
      difficulty: '简单',
      calories: 220,
      protein: '12g',
      vitamins: 'A, C',
      minerals: '钾, 铁',
      favorite: true,
      image: 'tomato-egg',
      tags: ['快手菜', '家常菜', '营养均衡']
    },
    {
      name: '炝炒土豆丝',
      weight: '250g',
      ingredients: ['土豆', '大蒜', '干辣椒', '油', '盐'],
      missing: ['干辣椒'],
      prepTime: '10分钟',
      cookTime: '5分钟',
      totalTime: '15分钟',
      storage: '冷藏2天',
      difficulty: '中等',
      calories: 180,
      protein: '3g',
      vitamins: 'B6, C',
      minerals: '钾, 镁',
      favorite: false,
      image: 'potato',
      tags: ['家常菜', '素食']
    },
    {
      name: '西兰花炒虾仁',
      weight: '350g',
      ingredients: ['西兰花', '虾仁', '大蒜', '姜', '油', '盐'],
      missing: ['西兰花', '姜'],
      prepTime: '7分钟',
      cookTime: '5分钟',
      totalTime: '12分钟',
      storage: '不宜存放',
      difficulty: '中等',
      calories: 240,
      protein: '18g',
      vitamins: 'A, C, B12',
      minerals: '钙, 铁, 锌',
      favorite: true,
      image: 'shrimp',
      tags: ['海鲜', '高蛋白', '营养均衡']
    },
    {
      name: '洋葱炒鸡蛋',
      weight: '280g',
      ingredients: ['洋葱', '鸡蛋', '油', '盐'],
      missing: [],
      prepTime: '3分钟',
      cookTime: '5分钟',
      totalTime: '8分钟',
      storage: '冷藏1天',
      difficulty: '简单',
      calories: 200,
      protein: '10g',
      vitamins: 'A, D, E',
      minerals: '硒, 钾',
      favorite: false,
      image: 'onion-egg',
      tags: ['快手菜', '家常菜']
    }
  ];
  
  // 用户统计
  const userStats = {
    level: 3,
    exp: 65,
    nextLevel: 100,
    completedRecipes: 12,
    favoriteCuisine: '家常菜',
    weeklyPlan: 3
  };
  
  // 分类
  const categories = [
    { name: '快手菜', color: 'bg-red-100 text-red-600', count: 18 },
    { name: '低卡饮食', color: 'bg-blue-100 text-blue-600', count: 24 },
    { name: '营养均衡', color: 'bg-yellow-100 text-yellow-600', count: 15 },
    { name: '高蛋白', color: 'bg-purple-100 text-purple-600', count: 12 }
  ];
  
  // 计算食材数量的最大值，用于进度条宽度
  const maxAmount = Math.max(...inventory.map(item => item.amount));
  
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-indigo-700">厨房小帮手</h1>
          <div className="flex items-center gap-3">
            <button 
              className="bg-gray-100 p-2 rounded-full"
              onClick={() => setShowFilterBar(!showFilterBar)}
            >
              <Filter size={18} className="text-gray-500" />
            </button>
            <button className="bg-gray-100 p-2 rounded-full">
              <User size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* 搜索栏 */}
        <div className="bg-gray-100 px-4 py-2">
          <div className="w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="搜索菜谱或食材..."
                className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          </div>
        </div>
        
        {/* 筛选栏 - 可折叠 */}
        {showFilterBar && (
          <div className="bg-white px-4 py-3 border-t border-gray-100 shadow-sm">
            <div className="w-full max-w-3xl mx-auto">
              <div className="flex overflow-x-auto py-1 gap-2 no-scrollbar">
                <button className="bg-indigo-500 text-white px-3 py-1 rounded-full text-xs whitespace-nowrap">
                  全部菜谱
                </button>
                {categories.map((cat, idx) => (
                  <button 
                    key={idx} 
                    className={`${cat.color.split(' ')[0]} ${cat.color.split(' ')[1].replace('text', 'bg')}/10 px-3 py-1 rounded-full text-xs whitespace-nowrap`}
                  >
                    {cat.name} ({cat.count})
                  </button>
                ))}
                <button className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                  可直接制作
                </button>
                <button className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                  缺少食材
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* 主内容区 - 增加最大宽度 */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4 pb-20">
        {activeTab === 'home' && (
          <>
            {/* 用户统计信息卡片 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 shadow-md mb-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">料理等级: {userStats.level}</h3>
                  <div className="w-full bg-white/30 rounded-full h-2 mt-1">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ width: `${(userStats.exp/userStats.nextLevel) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">再获得 {userStats.nextLevel - userStats.exp} 点经验升级!</p>
                </div>
                <div className="bg-white text-indigo-600 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                  {userStats.level}
                </div>
              </div>
              <div className="flex justify-between mt-3 text-xs">
                <div className="flex items-center">
                  <Award size={14} className="mr-1" />
                  <span>已完成料理: {userStats.completedRecipes}</span>
                </div>
                <div>偏好菜系: {userStats.favoriteCuisine}</div>
                <div>本周计划: {userStats.weeklyPlan}/7</div>
              </div>
            </div>
        
            {/* 当前食材库存区域 - 改为三列横条展示 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">您的食材库存</h2>
                <button className="text-sm text-indigo-600 flex items-center">
                  管理库存 <Plus size={16} className="ml-1" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow">
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {inventory.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`h-5 rounded ${item.color}`} style={{ width: `${(item.amount / maxAmount) * 80}%`, minWidth: '15px', maxWidth: '50px' }}></div>
                      <span className="text-sm text-gray-700 ml-2 truncate">{item.name} ({item.amount})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* 今日推荐菜谱 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-800">今日推荐料理</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-1">根据您的库存</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* 菜谱卡片列表 - 修复按钮显示问题，优化图片显示 */}
        <div className="space-y-4 mb-6">
          {recipes.map((recipe, index) => {
            // 计算这道菜的"完成度"供内部使用
            const total = recipe.ingredients.length;
            const have = recipe.ingredients.filter(ing => inventory.some(i => i.name === ing)).length;
            const completion = Math.round((have / total) * 100);
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-xl shadow overflow-hidden transition hover:shadow-md ${
                  recipe.missing.length === 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-amber-400'
                }`}
              >
                <div className="flex">
                  {/* 左侧图片区域 - 调整为上下居中 */}
                  <div className="w-24 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    {/* 确保图片居中显示 */}
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
                    
                    {/* 时间信息区域 - 对齐方式优化 */}
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
                      {recipe.missing.length > 0 ? (
                        <>
                          <span className="text-xs font-medium text-amber-600">缺少:</span>
                          {recipe.missing.map((item, idx) => (
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
                    
                    {/* 操作按钮 - 确保不被截断 */}
                    <div className="mt-2 flex justify-between items-center">
                      {/* 左侧显示卡路里等核心信息 */}
                      <div className="text-xs text-gray-600">
                        {recipe.calories}卡 · 蛋白{recipe.protein}
                      </div>
                      
                      {/* 右侧操作按钮 - 布局调整确保完全显示 */}
                      <div className="flex items-center">
                        <button className={`${
                          recipe.missing.length === 0 
                            ? 'bg-green-500 text-white' 
                            : 'bg-amber-400 text-amber-800'
                          } text-xs px-2 py-1 rounded-full flex items-center mr-1`}
                        >
                          {recipe.missing.length === 0 ? '开始烹饪' : '查看详情'}
                        </button>
                        <button className="bg-gray-200 text-gray-600 p-1 rounded-full flex-shrink-0 ml-1">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 热门分类 - 移到今日料理下方 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">热门分类</h2>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="text-center">
                <div className={`${cat.color.split(' ')[0]} rounded-lg p-3 mb-1`}>
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
                    <span className={cat.color.split(' ')[1]}>{cat.count}</span>
                  </div>
                </div>
                <p className="text-xs">{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* 烹饪小技巧 */}
        <div className="mt-6 bg-indigo-50 rounded-xl p-4 shadow-sm border border-indigo-100">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <Book size={18} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium text-indigo-800">料理小技巧</h3>
              <p className="text-xs text-gray-600 mt-1">尝试组合不同食材可能会发现意想不到的美味! 探索新的食材搭配来解锁特殊料理。</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* 底部导航栏 - 已扩展 */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg">
        <div className="w-full max-w-3xl mx-auto flex justify-around">
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('home')}
          >
            <ShoppingBag size={18} />
            <span className="text-xs mt-1">食材库</span>
          </button>
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'recipes' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('recipes')}
          >
            <Book size={18} />
            <span className="text-xs mt-1">菜谱</span>
          </button>
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'today' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('today')}
          >
            <Calendar size={18} />
            <span className="text-xs mt-1">今日待做</span>
          </button>
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'shopping' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('shopping')}
          >
            <List size={18} />
            <span className="text-xs mt-1">购物清单</span>
          </button>
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span className="text-xs mt-1">我的</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default KitchenAppFinal; 