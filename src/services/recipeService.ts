import { supabase } from '../contexts/AuthContext';
import { Recipe, RecipeStep } from '../types';

// 获取所有菜谱
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    // 获取基本菜谱信息
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*');

    if (error) throw error;
    if (!recipes) return [];

    // 对每个菜谱获取详细信息
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        const [tags, steps, tips, pairings, ingredients] = await Promise.all([
          // 获取菜谱标签
          supabase.from('recipe_tags').select('tag').eq('recipe_id', recipe.id),
          // 获取菜谱步骤
          supabase.from('recipe_steps').select('*').eq('recipe_id', recipe.id).order('step_number', { ascending: true }),
          // 获取菜谱提示
          supabase.from('recipe_tips').select('tip').eq('recipe_id', recipe.id),
          // 获取菜谱搭配建议
          supabase.from('recipe_pairings').select('pairing').eq('recipe_id', recipe.id),
          // 获取菜谱所需食材
          supabase.from('recipe_ingredients').select('ingredient_name').eq('recipe_id', recipe.id)
        ]);

        return {
          id: recipe.id,
          name: recipe.name,
          weight: recipe.weight,
          prepTime: recipe.prep_time,
          cookTime: recipe.cook_time,
          totalTime: recipe.total_time,
          storage: recipe.storage,
          difficulty: recipe.difficulty,
          calories: recipe.calories,
          protein: recipe.protein,
          fat: recipe.fat,
          carbs: recipe.carbs,
          vitamins: recipe.vitamins,
          minerals: recipe.minerals,
          favorite: recipe.favorite,
          rating: recipe.rating,
          reviewCount: recipe.review_count,
          image: recipe.image,
          description: recipe.description,
          tags: tags.data?.map(t => t.tag) || [],
          steps: steps.data?.map(s => ({
            step: s.step_number,
            description: s.description,
            time: s.time,
            tip: s.tip
          })) || [],
          tips: tips.data?.map(t => t.tip) || [],
          pairings: pairings.data?.map(p => p.pairing) || [],
          ingredients: ingredients.data?.map(i => i.ingredient_name) || [],
          missing: [] // 将在前端根据用户库存计算
        };
      })
    );

    return recipesWithDetails;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// 获取单个菜谱详情
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    // 获取基本菜谱信息
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!recipe) return null;

    // 获取菜谱的详细信息
    const [tags, steps, tips, pairings, ingredients] = await Promise.all([
      // 获取菜谱标签
      supabase.from('recipe_tags').select('tag').eq('recipe_id', id),
      // 获取菜谱步骤
      supabase.from('recipe_steps').select('*').eq('recipe_id', id).order('step_number', { ascending: true }),
      // 获取菜谱提示
      supabase.from('recipe_tips').select('tip').eq('recipe_id', id),
      // 获取菜谱搭配建议
      supabase.from('recipe_pairings').select('pairing').eq('recipe_id', id),
      // 获取菜谱所需食材
      supabase.from('recipe_ingredients').select('ingredient_name').eq('recipe_id', id)
    ]);

    return {
      id: recipe.id,
      name: recipe.name,
      weight: recipe.weight,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      totalTime: recipe.total_time,
      storage: recipe.storage,
      difficulty: recipe.difficulty,
      calories: recipe.calories,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      vitamins: recipe.vitamins,
      minerals: recipe.minerals,
      favorite: recipe.favorite,
      rating: recipe.rating,
      reviewCount: recipe.review_count,
      image: recipe.image,
      description: recipe.description,
      tags: tags.data?.map(t => t.tag) || [],
      steps: steps.data?.map(s => ({
        step: s.step_number,
        description: s.description,
        time: s.time,
        tip: s.tip
      })) || [],
      tips: tips.data?.map(t => t.tip) || [],
      pairings: pairings.data?.map(p => p.pairing) || [],
      ingredients: ingredients.data?.map(i => i.ingredient_name) || [],
      missing: [] // 将在前端根据用户库存计算
    };
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};

// 更新菜谱收藏状态
export const toggleFavorite = async (recipeId: string, isFavorite: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('recipes')
      .update({ favorite: isFavorite })
      .eq('id', recipeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating favorite status:', error);
    return false;
  }
};

// 根据用户库存计算缺失的食材
export const calculateMissingIngredients = (recipe: Recipe, userIngredients: string[]): string[] => {
  if (!userIngredients || userIngredients.length === 0) {
    return recipe.ingredients; // 如果用户没有食材，则所有食材都缺失
  }
  return recipe.ingredients.filter(ingredient => !userIngredients.includes(ingredient));
};

// 获取用户可以完成的菜谱推荐
export const getRecommendedRecipes = async (userIngredients: string[]): Promise<Recipe[]> => {
  try {
    // 检查用户是否有库存食材
    if (!userIngredients || userIngredients.length === 0) {
      console.log('用户库存为空，返回所有菜谱');
      const allRecipes = await getAllRecipes();
      return allRecipes.map(recipe => ({
        ...recipe,
        missing: recipe.ingredients // 所有食材都标记为缺失
      }));
    }
    
    console.log('用户库存食材:', userIngredients);
    
    // 获取所有菜谱
    const allRecipes = await getAllRecipes();
    if (!allRecipes || allRecipes.length === 0) {
      console.log('没有找到菜谱数据');
      return [];
    }
    
    console.log(`找到${allRecipes.length}个菜谱`);
    
    // 为每个菜谱计算缺失的食材
    const recipesWithMissing = allRecipes.map(recipe => {
      const missing = calculateMissingIngredients(recipe, userIngredients);
      const matchRatio = (recipe.ingredients.length - missing.length) / recipe.ingredients.length;
      return { 
        ...recipe, 
        missing,
        matchRatio // 添加匹配率
      };
    });

    // 按照以下优先级排序:
    // 1. 可以直接制作的菜谱（无缺失食材）
    // 2. 匹配率高的菜谱（缺少的食材少）
    // 3. 准备时间短的菜谱
    const sortedRecipes = recipesWithMissing.sort((a, b) => {
      // 先按照匹配率排序，匹配率高的优先
      if (a.matchRatio !== b.matchRatio) {
        return b.matchRatio - a.matchRatio;
      }
      
      // 匹配率相同时，准备时间短的优先
      const aPrepTime = parseInt(a.prepTime) || 0;
      const bPrepTime = parseInt(b.prepTime) || 0;
      return aPrepTime - bPrepTime;
    });
    
    console.log(`推荐菜谱排序完成，返回${sortedRecipes.length}个菜谱`);
    return sortedRecipes;
  } catch (error) {
    console.error('获取推荐菜谱时出错:', error);
    return [];
  }
};

// 完成菜谱时更新用户统计
export const completeRecipe = async (userId: string): Promise<boolean> => {
  try {
    // 先增加用户完成的菜谱数量
    const { error: updateError } = await supabase
      .from('user_stats')
      .update({ 
        completed_recipes: supabase.rpc('increment', { x: 1 }) 
      })
      .eq('user_id', userId);

    if (updateError) throw updateError;
    
    // 增加经验值
    const { data: userData, error: fetchError } = await supabase
      .from('user_stats')
      .select('exp, next_level, level')
      .eq('user_id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!userData) throw new Error('找不到用户数据');

    // 计算新的经验值
    let newExp = userData.exp + 50; // 每完成一个菜谱奖励50经验值
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
    
    return true;
  } catch (error) {
    console.error('Error completing recipe:', error);
    return false;
  }
}; 