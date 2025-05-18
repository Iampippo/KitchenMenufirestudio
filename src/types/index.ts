export interface Ingredient {
  id: string;
  name: string;
  color: string;
  amount: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Recipe {
  id: string;
  name: string;
  weight: string;
  ingredients: string[];
  missing: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  storage: string;
  difficulty: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  vitamins: string;
  minerals: string;
  favorite: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  description: string;
  steps: RecipeStep[];
  tips: string[];
  pairings: string[];
}

export interface RecipeStep {
  step: number;
  description: string;
  time: string;
  tip?: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  count: number;
}

export interface UserStats {
  level: number;
  exp: number;
  nextLevel: number;
  completedRecipes: number;
  favoriteCuisine: string;
  weeklyPlan: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  added: boolean;
}

export interface InventoryContextType {
  inventory: Ingredient[];
  availableIngredients: Ingredient[];
  updateInventory: (newInventory: Ingredient[]) => void;
  deleteIngredient: (id: string) => void;
  updateIngredientAmount: (id: string, change: number) => void;
  addIngredient: (ingredientName: string, amount: number) => void;
  isLoading: boolean;
  initializeData: () => void;
}