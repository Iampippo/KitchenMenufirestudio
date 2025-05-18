import { supabase } from '../contexts/AuthContext';
import { Ingredient } from '../types';

// 定义数据库中食材的类型
interface IngredientDB {
  id: string;
  name: string;
  color: string;
  amount: number;
  user_id: string;
}

// 获取系统食材列表（用于用户添加到库存）
export const getSystemIngredients = async (): Promise<Ingredient[]> => {
  try {
    const systemUserId = '00000000-0000-0000-0000-000000000000'; // 系统食材的特殊ID
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', systemUserId)
      .order('name');

    if (error) throw error;

    return (data || []).map((item: IngredientDB) => ({
      id: item.id,
      name: item.name,
      color: item.color,
      amount: 0 // 系统食材默认数量为0
    }));
  } catch (error) {
    console.error('Error fetching system ingredients:', error);
    return [];
  }
};

// 获取用户库存中的食材
export const getUserIngredients = async (userId: string): Promise<Ingredient[]> => {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;

    return (data || []).map((item: IngredientDB) => ({
      id: item.id,
      name: item.name,
      color: item.color,
      amount: item.amount
    }));
  } catch (error) {
    console.error('Error fetching user ingredients:', error);
    return [];
  }
};

// 根据名称查找系统食材
export const findSystemIngredientByName = async (name: string): Promise<Ingredient | null> => {
  try {
    const systemUserId = '00000000-0000-0000-0000-000000000000';
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', systemUserId)
      .eq('name', name)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      color: data.color,
      amount: 0
    };
  } catch (error) {
    console.error('Error finding system ingredient:', error);
    return null;
  }
};

// 添加食材到用户库存
export const addIngredientToInventory = async (
  userId: string,
  name: string,
  initialAmount: number = 1
): Promise<Ingredient | null> => {
  try {
    // 先检查用户库存是否已有此食材
    const { data: existingIngredient } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name)
      .single();

    if (existingIngredient) {
      // 如果已存在，则增加数量
      const updatedAmount = existingIngredient.amount + initialAmount;
      
      const { data, error } = await supabase
        .from('ingredients')
        .update({ amount: updatedAmount })
        .eq('id', existingIngredient.id)
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        color: data.color,
        amount: data.amount
      };
    } else {
      // 如果不存在，则从系统食材中获取信息并添加到用户库存
      const systemIngredient = await findSystemIngredientByName(name);
      
      if (!systemIngredient) {
        throw new Error(`系统中不存在食材: ${name}`);
      }
      
      const { data, error } = await supabase
        .from('ingredients')
        .insert({
          name: systemIngredient.name,
          color: systemIngredient.color,
          amount: initialAmount,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        color: data.color,
        amount: data.amount
      };
    }
  } catch (error) {
    console.error('Error adding ingredient to inventory:', error);
    return null;
  }
};

// 更新库存食材数量
export const updateIngredientAmount = async (
  ingredientId: string,
  newAmount: number
): Promise<boolean> => {
  try {
    // 不允许负数数量
    if (newAmount < 0) newAmount = 0;
    
    const { error } = await supabase
      .from('ingredients')
      .update({ amount: newAmount })
      .eq('id', ingredientId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating ingredient amount:', error);
    return false;
  }
};

// 从库存中删除食材
export const removeIngredientFromInventory = async (ingredientId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', ingredientId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing ingredient from inventory:', error);
    return false;
  }
};

// 获取用户库存中的食材名称列表（只返回数量大于0的食材）
export const getUserIngredientNames = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('name, amount')
      .eq('user_id', userId)
      .gt('amount', 0); // 只获取数量大于0的食材
    
    if (error) throw error;
    
    // 只返回名称列表
    return data.map((item: { name: string }) => item.name);
  } catch (error) {
    console.error('Error getting user ingredient names:', error);
    return [];
  }
}; 