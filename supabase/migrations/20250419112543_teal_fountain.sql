/*
  # Add recipe ingredients with unique names

  1. Changes
    - Add unique constraint on ingredient names
    - Insert all ingredients mentioned in recipes with default user_id
    - Add ingredient colors for visual display
    - Set default amounts to 0

  2. Data
    - Basic ingredients (vegetables, meat, etc)
    - Condiments and seasonings
    - Special ingredients for specific recipes
*/

-- First ensure name column has a unique constraint
ALTER TABLE ingredients ADD CONSTRAINT ingredients_name_key UNIQUE (name);

-- Create a default system user for initial ingredients
DO $$
DECLARE
  system_user_id uuid;
BEGIN
  INSERT INTO auth.users (id, email)
  VALUES ('00000000-0000-0000-0000-000000000000', 'system@kitchen.helper')
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO system_user_id;

  -- Insert ingredients with their display colors
  INSERT INTO ingredients (name, color, amount, user_id) VALUES
    -- 西红柿炒鸡蛋的食材
    ('西红柿', 'bg-red-400', 0, system_user_id),
    ('鸡蛋', 'bg-yellow-200', 0, system_user_id),
    ('油', 'bg-yellow-400', 0, system_user_id),
    ('盐', 'bg-gray-100', 0, system_user_id),
    ('大蒜', 'bg-gray-200', 0, system_user_id),
    ('葱', 'bg-green-400', 0, system_user_id),
    ('白糖', 'bg-gray-100', 0, system_user_id),

    -- 香煎三文鱼的食材
    ('三文鱼', 'bg-orange-300', 0, system_user_id),
    ('橄榄油', 'bg-yellow-400', 0, system_user_id),
    ('黑胡椒', 'bg-gray-700', 0, system_user_id),
    ('柠檬', 'bg-yellow-300', 0, system_user_id),

    -- 炝炒土豆丝的食材
    ('土豆', 'bg-yellow-600', 0, system_user_id),
    ('干辣椒', 'bg-red-500', 0, system_user_id),

    -- 其他常用调味料
    ('酱油', 'bg-amber-900', 0, system_user_id),
    ('醋', 'bg-amber-700', 0, system_user_id),
    ('料酒', 'bg-yellow-500', 0, system_user_id),
    ('蚝油', 'bg-amber-800', 0, system_user_id),
    ('豆瓣酱', 'bg-red-700', 0, system_user_id),
    ('花椒', 'bg-red-800', 0, system_user_id),
    ('八角', 'bg-amber-600', 0, system_user_id),
    
    -- 其他常用食材
    ('洋葱', 'bg-purple-300', 0, system_user_id),
    ('胡萝卜', 'bg-orange-400', 0, system_user_id),
    ('青椒', 'bg-green-500', 0, system_user_id),
    ('猪肉', 'bg-red-300', 0, system_user_id),
    ('牛肉', 'bg-red-400', 0, system_user_id),
    ('虾仁', 'bg-orange-300', 0, system_user_id),
    ('姜', 'bg-yellow-700', 0, system_user_id)
  ON CONFLICT (name) DO NOTHING;
END $$;