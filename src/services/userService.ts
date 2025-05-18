import { supabase } from '../contexts/AuthContext';
import { UserStats } from '../types';

// 获取用户统计信息
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      level: data.level,
      exp: data.exp,
      nextLevel: data.next_level,
      completedRecipes: data.completed_recipes,
      favoriteCuisine: data.favorite_cuisine || '',
      weeklyPlan: data.weekly_plan,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
};

// 更新用户统计信息
export const updateUserStats = async (
  userId: string,
  stats: Partial<UserStats>
): Promise<boolean> => {
  try {
    const updateData: any = {};
    
    if (stats.level !== undefined) updateData.level = stats.level;
    if (stats.exp !== undefined) updateData.exp = stats.exp;
    if (stats.nextLevel !== undefined) updateData.next_level = stats.nextLevel;
    if (stats.completedRecipes !== undefined) updateData.completed_recipes = stats.completedRecipes;
    if (stats.favoriteCuisine !== undefined) updateData.favorite_cuisine = stats.favoriteCuisine;
    if (stats.weeklyPlan !== undefined) updateData.weekly_plan = stats.weeklyPlan;
    
    const { error } = await supabase
      .from('user_stats')
      .update(updateData)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating user stats:', error);
    return false;
  }
};

// 增加用户经验值并检查升级
export const addUserExperience = async (
  userId: string,
  expAmount: number
): Promise<{ updated: boolean; leveledUp: boolean; newLevel?: number }> => {
  try {
    // 获取当前用户数据
    const { data: userData, error: fetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!userData) throw new Error('找不到用户数据');

    // 计算新的经验值
    let newExp = userData.exp + expAmount;
    let newLevel = userData.level;
    let leveledUp = false;

    // 检查是否升级
    if (newExp >= userData.next_level) {
      newLevel += 1;
      newExp = newExp - userData.next_level;
      const newNextLevel = Math.floor(userData.next_level * 1.5); // 增加下一级所需经验
      leveledUp = true;

      // 更新数据库
      const { error } = await supabase
        .from('user_stats')
        .update({
          level: newLevel,
          exp: newExp,
          next_level: newNextLevel
        })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // 只更新经验值
      const { error } = await supabase
        .from('user_stats')
        .update({ exp: newExp })
        .eq('user_id', userId);

      if (error) throw error;
    }

    return {
      updated: true,
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined
    };
  } catch (error) {
    console.error('Error adding user experience:', error);
    return { updated: false, leveledUp: false };
  }
};

// 完成菜谱时更新用户统计
export const completeRecipe = async (userId: string): Promise<boolean> => {
  try {
    // 获取当前完成的菜谱数
    const { data, error: fetchError } = await supabase
      .from('user_stats')
      .select('completed_recipes')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!data) throw new Error('找不到用户数据');

    // 增加完成菜谱数并给予经验值奖励
    const { error } = await supabase
      .from('user_stats')
      .update({ 
        completed_recipes: data.completed_recipes + 1
      })
      .eq('user_id', userId);

    if (error) throw error;
    
    // 增加经验值
    await addUserExperience(userId, 50); // 每完成一个菜谱奖励50经验值
    
    return true;
  } catch (error) {
    console.error('Error completing recipe:', error);
    return false;
  }
}; 