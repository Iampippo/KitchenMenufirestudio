import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ingredient, InventoryContextType } from '../types';
import { useAuth } from './AuthContext';
import { inventoryData } from '../data/mockData'; // 作为备用数据
import { getSystemIngredients, getUserIngredients, addIngredientToInventory, updateIngredientAmount as updateAmount, removeIngredientFromInventory } from '../services/ingredientService';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserData(user.id);
    } else {
      // 未登录时使用模拟数据
      setInventory(inventoryData);
      setAvailableIngredients(inventoryData);
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // 获取用户的食材清单
      const userIngredients = await getUserIngredients(userId);
      
      // 获取系统食材清单（用于添加新食材时选择）
      const systemIngredients = await getSystemIngredients();

      // 如果没有获取到数据，使用模拟数据
      if ((!userIngredients || userIngredients.length === 0) && 
          (!systemIngredients || systemIngredients.length === 0)) {
        console.log('没有从数据库获取到数据，使用模拟数据');
        setInventory(inventoryData);
        setAvailableIngredients(inventoryData);
      } else {
        setInventory(userIngredients || []);
        setAvailableIngredients(systemIngredients || []);
      }
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      // 发生错误时使用模拟数据
      console.log('获取数据发生错误，使用模拟数据');
      setInventory(inventoryData);
      setAvailableIngredients(inventoryData);
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = async (ingredientName: string, amount: number) => {
    if (!user) {
      console.error('用户未登录，无法添加食材');
      return;
    }
    
    try {
      const addedIngredient = await addIngredientToInventory(user.id, ingredientName, amount);
      
      if (addedIngredient) {
        // 检查是否已存在该食材，如果存在则更新，否则添加
        const existingIndex = inventory.findIndex(i => i.id === addedIngredient.id);
        
        if (existingIndex >= 0) {
          // 更新现有食材
          const updatedInventory = [...inventory];
          updatedInventory[existingIndex] = addedIngredient;
          setInventory(updatedInventory);
        } else {
          // 添加新食材
          setInventory([...inventory, addedIngredient]);
        }
      }
    } catch (error) {
      console.error('添加食材失败:', error);
    }
  };

  const updateIngredientAmount = async (id: string, change: number) => {
    // 查找要更新的食材
    const itemToUpdate = inventory.find(item => item.id === id);
    if (!itemToUpdate) return;
    
    // 计算新数量
    const newAmount = Math.max(0, itemToUpdate.amount + change);
    
    try {
      // 调用服务更新数据库
      const success = await updateAmount(id, newAmount);
      
      if (success) {
        // 更新本地状态
        const updatedInventory = inventory.map(item =>
          item.id === id ? { ...item, amount: newAmount } : item
        );
        setInventory(updatedInventory);
      }
    } catch (error) {
      console.error('更新食材数量失败:', error);
    }
  };

  const deleteIngredient = async (id: string) => {
    try {
      // 调用服务从数据库删除
      const success = await removeIngredientFromInventory(id);
      
      if (success) {
        // 从本地状态删除
        setInventory(inventory.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('删除食材失败:', error);
    }
  };

  const updateInventory = (newInventory: Ingredient[]) => {
    setInventory(newInventory);
  };

  // 初始化数据的简化方法
  const initializeData = async () => {
    if (!user) {
      console.log('请先登录再初始化数据');
      return;
    }
    
    setIsLoading(true);
    try {
      // 获取系统食材列表
      const systemIngredients = await getSystemIngredients();
      
      if (systemIngredients && systemIngredients.length > 0) {
        console.log('系统食材数据已存在，无需初始化');
      } else {
        console.log('需要导入系统食材数据，请联系管理员运行seed脚本');
      }
      
      // 重新获取用户数据
      await fetchUserData(user.id);
    } catch (error) {
      console.error('初始化数据出错:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      inventory, 
      availableIngredients,
      updateInventory, 
      deleteIngredient, 
      updateIngredientAmount,
      addIngredient,
      isLoading,
      initializeData
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};