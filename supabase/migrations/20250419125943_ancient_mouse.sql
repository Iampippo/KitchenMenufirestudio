-- Add more ingredients to the system
DO $$
DECLARE
  system_user_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Insert more common ingredients with their display colors
  INSERT INTO ingredients (name, color, amount, user_id) VALUES
    -- 主食类
    ('面条', 'bg-yellow-200', 0, system_user_id),
    ('米饭', 'bg-yellow-100', 0, system_user_id),
    ('馒头', 'bg-gray-100', 0, system_user_id),
    ('面粉', 'bg-gray-200', 0, system_user_id),
    
    -- 肉类
    ('鸡肉', 'bg-orange-200', 0, system_user_id),
    ('排骨', 'bg-red-300', 0, system_user_id),
    ('五花肉', 'bg-red-400', 0, system_user_id),
    
    -- 海鲜类
    ('鱼片', 'bg-blue-300', 0, system_user_id),
    ('扇贝', 'bg-blue-200', 0, system_user_id),
    ('蛤蜊', 'bg-blue-100', 0, system_user_id),
    
    -- 豆制品
    ('豆腐', 'bg-yellow-50', 0, system_user_id),
    ('腐竹', 'bg-yellow-100', 0, system_user_id),
    ('豆干', 'bg-yellow-200', 0, system_user_id),
    
    -- 菌菇类
    ('香菇', 'bg-gray-700', 0, system_user_id),
    ('金针菇', 'bg-yellow-600', 0, system_user_id),
    ('木耳', 'bg-gray-800', 0, system_user_id),
    
    -- 叶菜类
    ('菠菜', 'bg-green-600', 0, system_user_id),
    ('生菜', 'bg-green-400', 0, system_user_id),
    ('韭菜', 'bg-green-500', 0, system_user_id),
    ('白菜', 'bg-green-200', 0, system_user_id),
    
    -- 调味料补充
    ('五香粉', 'bg-amber-500', 0, system_user_id),
    ('孜然粉', 'bg-amber-600', 0, system_user_id),
    ('芝麻油', 'bg-amber-700', 0, system_user_id),
    ('老抽', 'bg-amber-900', 0, system_user_id),
    ('生抽', 'bg-amber-800', 0, system_user_id)
  ON CONFLICT (name) DO NOTHING;
END $$;