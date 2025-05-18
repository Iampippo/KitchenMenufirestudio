import { supabase } from '../contexts/AuthContext';
import { ShoppingListItem } from '../types';

// 定义数据库中购物清单项目的类型
interface ShoppingListItemDB {
  id: string;
  user_id: string;
  name: string;
  quantity: string;
  added: boolean;
  created_at: string;
}

// 获取用户的购物清单
export const getShoppingList = async (userId: string): Promise<ShoppingListItem[]> => {
  try {
    const { data, error } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      added: item.added
    }));
  } catch (error) {
    console.error('Error getting shopping list:', error);
    return [];
  }
};

// 添加购物清单项目
export const addShoppingListItem = async (
  userId: string,
  name: string,
  quantity: string
): Promise<ShoppingListItem | null> => {
  try {
    // 检查是否已存在相同名称的商品
    const { data: existingItems } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('user_id', userId)
      .eq('name', name);

    if (existingItems && existingItems.length > 0) {
      // 如果已经存在，返回已存在的商品
      return {
        id: existingItems[0].id,
        name: existingItems[0].name,
        quantity: existingItems[0].quantity,
        added: existingItems[0].added
      };
    }

    // 添加新商品
    const { data, error } = await supabase
      .from('shopping_list')
      .insert({
        user_id: userId,
        name,
        quantity,
        added: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      quantity: data.quantity,
      added: data.added
    };
  } catch (error) {
    console.error('Error adding shopping list item:', error);
    return null;
  }
};

// 批量添加购物清单项目（如从菜谱添加缺少的食材）
export const addMultipleShoppingListItems = async (
  userId: string,
  items: { name: string; quantity: string }[]
): Promise<ShoppingListItem[]> => {
  try {
    const results: ShoppingListItem[] = [];

    // 逐个添加，以便处理已存在的项目
    for (const item of items) {
      const result = await addShoppingListItem(userId, item.name, item.quantity);
      if (result) {
        results.push(result);
      }
    }

    return results;
  } catch (error) {
    console.error('Error adding multiple shopping list items:', error);
    return [];
  }
};

// 更新购物清单项目
export const updateShoppingListItem = async (
  itemId: string,
  updates: Partial<{ name: string; quantity: string; added: boolean }>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shopping_list')
      .update(updates)
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    return false;
  }
};

// 删除购物清单项目
export const deleteShoppingListItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    return false;
  }
};

// 清空已添加的购物清单项目
export const clearAddedItems = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('user_id', userId)
      .eq('added', true);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing added items:', error);
    return false;
  }
}; 