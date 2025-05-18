/*
  # Initial schema setup for kitchen helper app

  1. New Tables
    - `ingredients`
      - `id` (uuid, primary key) 
      - `name` (text) - 食材名称
      - `color` (text) - UI显示颜色
      - `amount` (integer) - 库存数量
      - `user_id` (uuid) - 关联用户
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text) - 菜谱名称
      - `weight` (text) - 份量
      - `prep_time` (text) - 准备时间
      - `cook_time` (text) - 烹饪时间
      - `total_time` (text) - 总时间
      - `storage` (text) - 存放建议
      - `difficulty` (text) - 难度
      - `calories` (integer) - 卡路里
      - `protein` (text) - 蛋白质
      - `fat` (text) - 脂肪
      - `carbs` (text) - 碳水
      - `vitamins` (text) - 维生素
      - `minerals` (text) - 矿物质
      - `favorite` (boolean) - 是否收藏
      - `rating` (numeric) - 评分
      - `review_count` (integer) - 评价数
      - `image` (text) - 图片
      - `description` (text) - 描述
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `recipe_tags`
      - `recipe_id` (uuid) - 关联菜谱
      - `tag` (text) - 标签名称

    - `recipe_steps`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid) - 关联菜谱
      - `step_number` (integer) - 步骤序号
      - `description` (text) - 步骤描述
      - `time` (text) - 预计时间
      - `tip` (text) - 步骤提示

    - `recipe_tips`
      - `recipe_id` (uuid) - 关联菜谱
      - `tip` (text) - 烹饪提示

    - `recipe_pairings`
      - `recipe_id` (uuid) - 关联菜谱
      - `pairing` (text) - 搭配建议

    - `recipe_ingredients`
      - `recipe_id` (uuid) - 关联菜谱
      - `ingredient_name` (text) - 食材名称

    - `user_stats`
      - `user_id` (uuid, primary key) - 关联用户
      - `level` (integer) - 等级
      - `exp` (integer) - 经验值
      - `next_level` (integer) - 下一级所需经验
      - `completed_recipes` (integer) - 完成菜谱数
      - `favorite_cuisine` (text) - 偏好菜系
      - `weekly_plan` (integer) - 周计划数
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create ingredients table
CREATE TABLE ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  weight text,
  prep_time text,
  cook_time text,
  total_time text,
  storage text,
  difficulty text,
  calories integer,
  protein text,
  fat text,
  carbs text,
  vitamins text,
  minerals text,
  favorite boolean DEFAULT false,
  rating numeric,
  review_count integer DEFAULT 0,
  image text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe_tags table
CREATE TABLE recipe_tags (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);

-- Create recipe_steps table
CREATE TABLE recipe_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  description text NOT NULL,
  time text,
  tip text,
  UNIQUE (recipe_id, step_number)
);

-- Create recipe_tips table
CREATE TABLE recipe_tips (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tip text NOT NULL,
  PRIMARY KEY (recipe_id, tip)
);

-- Create recipe_pairings table
CREATE TABLE recipe_pairings (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  pairing text NOT NULL,
  PRIMARY KEY (recipe_id, pairing)
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_name)
);

-- Create user_stats table
CREATE TABLE user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  level integer NOT NULL DEFAULT 1,
  exp integer NOT NULL DEFAULT 0,
  next_level integer NOT NULL DEFAULT 100,
  completed_recipes integer NOT NULL DEFAULT 0,
  favorite_cuisine text,
  weekly_plan integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_pairings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all recipe related data"
  ON recipe_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all recipe steps"
  ON recipe_steps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all recipe tips"
  ON recipe_tips FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all recipe pairings"
  ON recipe_pairings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own ingredients"
  ON ingredients FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stats"
  ON user_stats FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);