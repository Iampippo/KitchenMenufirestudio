import React, { useState, useEffect } from 'react';
import { Search, Plus, Check, Trash, ArrowLeft, Filter, Edit, Share2, ShoppingBag, Book, User, Calendar, List, ChevronDown, ChevronUp, RotateCcw, PlusCircle, CheckSquare } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getShoppingList, addShoppingListItem, updateShoppingListItem, deleteShoppingListItem, clearAddedItems } from '../services/shoppingListService';
import { addIngredientToInventory } from '../services/ingredientService';
import { ShoppingListItem } from '../types';
import { toast } from 'react-hot-toast';

interface ShoppingListItemsByCategory {
  [category: string]: ShoppingListItem[];
}

const ShoppingListPage: React.FC = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [shoppingListItems, setShoppingListItems] = useState<ShoppingListItem[]>([]);
  const [shoppingListByCategory, setShoppingListByCategory] = useState<ShoppingListItemsByCategory>({});
  const [loading, setLoading] = useState(true);

  // 初始加载购物清单数据
  useEffect(() => {
    if (user) {
      fetchShoppingList();
    } else {
      setLoading(false);
      setShoppingListItems([]);
      setShoppingListByCategory({});
    }
  }, [user]);

  // 获取购物清单数据
  const fetchShoppingList = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const items = await getShoppingList(user.id);
      setShoppingListItems(items);
      
      // 将购物清单项按分类整理
      organizeItemsByCategory(items);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      toast.error('获取购物清单失败');
    } finally {
      setLoading(false);
    }
  };

  // 将购物清单项按分类整理
  const organizeItemsByCategory = (items: ShoppingListItem[]) => {
    const categorized: ShoppingListItemsByCategory = {};
    
    // 根据名称简单分类
    items.forEach(item => {
      let category = '其他';
      
      if (item.name.includes('蔬菜') || item.name.includes('水果') || 
          item.name.includes('菜') || item.name.includes('瓜') || 
          item.name.includes('葱') || item.name.includes('姜') || 
          item.name.includes('蒜')) {
        category = '蔬菜水果';
      } else if (item.name.includes('肉') || item.name.includes('鸡') || 
                 item.name.includes('蛋') || item.name.includes('奶') || 
                 item.name.includes('鱼') || item.name.includes('虾')) {
        category = '肉蛋奶';
      } else if (item.name.includes('盐') || item.name.includes('糖') || 
                 item.name.includes('油') || item.name.includes('酱') || 
                 item.name.includes('醋') || item.name.includes('料')) {
        category = '调味料';
      } else if (item.name.includes('米') || item.name.includes('面') || 
                 item.name.includes('粉') || item.name.includes('豆') || 
                 item.name.includes('干')) {
        category = '干货';
      }
      
      if (!categorized[category]) {
        categorized[category] = [];
      }
      
      categorized[category].push(item);
    });
    
    // 确保至少有一个分类
    if (Object.keys(categorized).length === 0) {
      categorized['购物清单'] = [];
    }
    
    setShoppingListByCategory(categorized);
  };

  // 计算总物品数和已选中物品数
  const getTotalItems = () => {
    let total = 0;
    let checked = 0;
    
    Object.values(shoppingListByCategory).forEach(category => {
      total += category.length;
      checked += category.filter(item => item.added).length;
    });
    
    return { total, checked };
  };
  
  const { total, checked } = getTotalItems();
  
  // 切换物品的选中状态
  const toggleItemCheck = async (categoryName: string, itemId: string) => {
    if (!user) return;
    
    const updatedList = {...shoppingListByCategory};
    const categoryItems = [...updatedList[categoryName]];
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      const item = categoryItems[itemIndex];
      const newAddedStatus = !item.added;
      
      try {
        // 更新数据库
        const success = await updateShoppingListItem(itemId, { added: newAddedStatus });
        
        if (success) {
          // 更新本地状态
          categoryItems[itemIndex] = {
            ...item,
            added: newAddedStatus
          };
          
          updatedList[categoryName] = categoryItems;
          setShoppingListByCategory(updatedList);
        }
      } catch (error) {
        console.error('Error toggling item check:', error);
        toast.error('更新物品状态失败');
      }
    }
  };
  
  // 删除物品
  const deleteItem = async (categoryName: string, itemId: string) => {
    if (!user) return;
    
    try {
      // 从数据库删除
      const success = await deleteShoppingListItem(itemId);
      
      if (success) {
        // 更新本地状态
        const updatedList = {...shoppingListByCategory};
        updatedList[categoryName] = updatedList[categoryName].filter(item => item.id !== itemId);
        
        if (updatedList[categoryName].length === 0) {
          delete updatedList[categoryName];
        }
        
        setShoppingListByCategory(updatedList);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('删除物品失败');
    }
  };
  
  // 添加新物品
  const addNewItem = async () => {
    if (!user || !newItem.trim()) return;
    
    try {
      // 添加到数据库
      const addedItem = await addShoppingListItem(user.id, newItem.trim(), '适量');
      
      if (addedItem) {
        // 更新本地状态
        const category = '其他';
        const updatedList = {...shoppingListByCategory};
        
        if (!updatedList[category]) {
          updatedList[category] = [];
        }
        
        updatedList[category] = [...updatedList[category], addedItem];
        setShoppingListByCategory(updatedList);
        setNewItem('');
        
        toast.success('物品已添加');
      }
    } catch (error) {
      console.error('Error adding new item:', error);
      toast.error('添加物品失败');
    }
  };
  
  // 清除已选中的物品
  const clearCheckedItems = async () => {
    if (!user) return;
    
    try {
      // 从数据库清除
      const success = await clearAddedItems(user.id);
      
      if (success) {
        // 更新本地状态
        const updatedList = {...shoppingListByCategory};
        
        Object.keys(updatedList).forEach(category => {
          updatedList[category] = updatedList[category].filter(item => !item.added);
          
          if (updatedList[category].length === 0) {
            delete updatedList[category];
          }
        });
        
        setShoppingListByCategory(updatedList);
        toast.success('已选物品已清除');
      }
    } catch (error) {
      console.error('Error clearing checked items:', error);
      toast.error('清除已选物品失败');
    }
  };
  
  // 将选中的物品添加到库存
  const addCheckedItemsToInventory = async () => {
    if (!user) return;
    
    try {
      let addCount = 0;
      
      // 获取所有已选中的物品
      for (const category of Object.keys(shoppingListByCategory)) {
        for (const item of shoppingListByCategory[category]) {
          if (item.added) {
            // 添加到库存
            const result = await addIngredientToInventory(user.id, item.name, 1);
            if (result) {
              addCount++;
            }
          }
        }
      }
      
      if (addCount > 0) {
        // 清除已选中物品
        await clearCheckedItems();
        toast.success(`已将${addCount}个物品添加到库存`);
      }
    } catch (error) {
      console.error('Error adding items to inventory:', error);
      toast.error('添加物品到库存失败');
    }
  };

  // 渲染购物清单内容
  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      <Header 
        title="购物清单" 
        isDetailPage={true}
        onBackClick={() => window.history.back()}
      />
      
      <main className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* 状态栏 */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <ShoppingBag size={18} className="text-indigo-600 mr-2" />
              <span className="font-medium text-gray-800">购物清单</span>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span>已选: {checked}/{total}</span>
            </div>
          </div>
        </motion.div>
        
        {/* 加载状态 */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* 购物清单为空状态 */}
        {!loading && total === 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-sm p-8 mb-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-gray-400 mb-4">
              <ShoppingBag size={48} className="mx-auto mb-2" />
              <p>购物清单为空</p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              添加你需要购买的食材或从菜谱中导入食材
            </p>
          </motion.div>
        )}
        
        {/* 购物清单内容 */}
        {!loading && total > 0 && (
          <>
            {Object.entries(shoppingListByCategory).map(([category, items]) => (
              <motion.div 
                key={category}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                </div>
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <li key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button 
                            className={`w-6 h-6 rounded-full border ${
                              item.added 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300'
                            } flex items-center justify-center mr-3`}
                            onClick={() => toggleItemCheck(category, item.id)}
                          >
                            {item.added && <Check size={14} />}
                          </button>
                          <div>
                            <span className={`text-gray-800 ${item.added ? 'line-through text-gray-400' : ''}`}>
                              {item.name}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.quantity}
                            </div>
                          </div>
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500"
                          onClick={() => deleteItem(category, item.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            
            {/* 功能按钮 */}
            <div className="flex gap-3 mb-4">
              <button 
                className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium flex items-center justify-center"
                onClick={clearCheckedItems}
                disabled={checked === 0}
              >
                <Trash size={16} className="mr-1" />
                清除已选
              </button>
              <button 
                className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium flex items-center justify-center"
                onClick={addCheckedItemsToInventory}
                disabled={checked === 0}
              >
                <Check size={16} className="mr-1" />
                添加到库存
              </button>
            </div>
          </>
        )}
        
        {/* 添加商品输入框 */}
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <div className="w-full max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="添加食材..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewItem()}
            />
            <button
              className="bg-indigo-500 text-white rounded-lg px-4 py-2 flex items-center"
              onClick={addNewItem}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ShoppingListPage;