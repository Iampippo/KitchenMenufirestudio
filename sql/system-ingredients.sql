-- 食材分类
CREATE TABLE IF NOT EXISTS ingredient_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- 系统食材表初始化
INSERT INTO ingredient_categories (name, description) 
VALUES 
  ('肉类', '各种肉类食材'),
  ('蔬菜', '各种蔬菜类食材'),
  ('水产', '海鲜和河鲜食材'),
  ('调味料', '各种调味料'),
  ('粮食', '米面豆类等主食食材'),
  ('蛋奶', '蛋类和奶制品'),
  ('水果', '各种水果'),
  ('干货', '干货和坚果类');

-- 删除系统用户的已有食材以便重新插入
DELETE FROM ingredients WHERE user_id = '00000000-0000-0000-0000-000000000000';

-- 插入系统食材数据
INSERT INTO ingredients (id, name, color, amount, unit, category_id, user_id)
VALUES
  -- 蔬菜类
  (gen_random_uuid(), '西红柿', 'bg-red-400', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '土豆', 'bg-yellow-600', 1000, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '洋葱', 'bg-purple-300', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '大蒜', 'bg-gray-200', 200, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '葱', 'bg-green-400', 100, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '姜', 'bg-yellow-700', 100, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '青椒', 'bg-green-600', 200, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '黄瓜', 'bg-green-500', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '胡萝卜', 'bg-orange-500', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '西兰花', 'bg-green-700', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '莴笋', 'bg-green-300', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '茄子', 'bg-purple-600', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '白菜', 'bg-green-200', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '香菜', 'bg-green-500', 50, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '生菜', 'bg-green-300', 200, 'g', (SELECT id FROM ingredient_categories WHERE name = '蔬菜'), '00000000-0000-0000-0000-000000000000'),
  
  -- 肉类
  (gen_random_uuid(), '猪肉', 'bg-red-300', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '肉类'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '牛肉', 'bg-red-700', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '肉类'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '鸡肉', 'bg-orange-200', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '肉类'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '羊肉', 'bg-red-800', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '肉类'), '00000000-0000-0000-0000-000000000000'),
  
  -- 水产
  (gen_random_uuid(), '虾仁', 'bg-orange-300', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '带鱼', 'bg-gray-400', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '三文鱼', 'bg-orange-400', 400, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '龙虾', 'bg-red-500', 700, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '螃蟹', 'bg-orange-600', 600, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '鱿鱼', 'bg-gray-300', 400, 'g', (SELECT id FROM ingredient_categories WHERE name = '水产'), '00000000-0000-0000-0000-000000000000'),
  
  -- 蛋奶
  (gen_random_uuid(), '鸡蛋', 'bg-yellow-200', 10, '个', (SELECT id FROM ingredient_categories WHERE name = '蛋奶'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '鸭蛋', 'bg-blue-100', 10, '个', (SELECT id FROM ingredient_categories WHERE name = '蛋奶'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '牛奶', 'bg-gray-100', 1000, 'ml', (SELECT id FROM ingredient_categories WHERE name = '蛋奶'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '奶油', 'bg-yellow-100', 200, 'g', (SELECT id FROM ingredient_categories WHERE name = '蛋奶'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '奶酪', 'bg-yellow-300', 200, 'g', (SELECT id FROM ingredient_categories WHERE name = '蛋奶'), '00000000-0000-0000-0000-000000000000'),
  
  -- 调味料
  (gen_random_uuid(), '油', 'bg-yellow-400', 1000, 'ml', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '盐', 'bg-gray-100', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '胡椒', 'bg-gray-400', 100, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '花生油', 'bg-yellow-500', 1000, 'ml', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '酱油', 'bg-yellow-900', 500, 'ml', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '醋', 'bg-yellow-800', 500, 'ml', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '白糖', 'bg-gray-100', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '料酒', 'bg-yellow-600', 500, 'ml', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '豆瓣酱', 'bg-red-900', 300, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '辣椒粉', 'bg-red-600', 100, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '干辣椒', 'bg-red-500', 100, 'g', (SELECT id FROM ingredient_categories WHERE name = '调味料'), '00000000-0000-0000-0000-000000000000'),
  
  -- 粮食
  (gen_random_uuid(), '大米', 'bg-yellow-100', 5000, 'g', (SELECT id FROM ingredient_categories WHERE name = '粮食'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '面粉', 'bg-gray-100', 2000, 'g', (SELECT id FROM ingredient_categories WHERE name = '粮食'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '通心粉', 'bg-yellow-200', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '粮食'), '00000000-0000-0000-0000-000000000000'),
  (gen_random_uuid(), '意大利面', 'bg-yellow-300', 500, 'g', (SELECT id FROM ingredient_categories WHERE name = '粮食'), '00000000-0000-0000-0000-000000000000'); 