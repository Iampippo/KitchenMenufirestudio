/*
  # Initial Schema Setup
  
  1. New Tables
    - ingredients (user's ingredient inventory)
    - recipes (recipe information)
    - recipe_tags (recipe categorization)
    - recipe_steps (cooking instructions)
    - recipe_tips (cooking tips)
    - recipe_pairings (recommended pairings)
    - recipe_ingredients (required ingredients)
    - user_stats (user progress tracking)
    
  2. Security
    - Enable RLS on all tables
    - Set up appropriate access policies
*/

-- Create ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
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
CREATE TABLE IF NOT EXISTS recipe_tags (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tag text NOT NULL,
  PRIMARY KEY (recipe_id, tag)
);

-- Create recipe_steps table
CREATE TABLE IF NOT EXISTS recipe_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  description text NOT NULL,
  time text,
  tip text,
  UNIQUE (recipe_id, step_number)
);

-- Create recipe_tips table
CREATE TABLE IF NOT EXISTS recipe_tips (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  tip text NOT NULL,
  PRIMARY KEY (recipe_id, tip)
);

-- Create recipe_pairings table
CREATE TABLE IF NOT EXISTS recipe_pairings (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  pairing text NOT NULL,
  PRIMARY KEY (recipe_id, pairing)
);

-- Create recipe_ingredients table
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_name text NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_name)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
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
DO $$ 
BEGIN
  EXECUTE 'ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipes ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipe_tips ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipe_pairings ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY';
  EXECUTE 'ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY';
EXCEPTION 
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipes'
  ) THEN
    CREATE POLICY "Users can read all recipes"
      ON recipes FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipe related data'
  ) THEN
    CREATE POLICY "Users can read all recipe related data"
      ON recipe_tags FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipe steps'
  ) THEN
    CREATE POLICY "Users can read all recipe steps"
      ON recipe_steps FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipe tips'
  ) THEN
    CREATE POLICY "Users can read all recipe tips"
      ON recipe_tips FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipe pairings'
  ) THEN
    CREATE POLICY "Users can read all recipe pairings"
      ON recipe_pairings FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read all recipe ingredients'
  ) THEN
    CREATE POLICY "Users can read all recipe ingredients"
      ON recipe_ingredients FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own ingredients'
  ) THEN
    CREATE POLICY "Users can manage their own ingredients"
      ON ingredients FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own stats'
  ) THEN
    CREATE POLICY "Users can manage their own stats"
      ON user_stats FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;