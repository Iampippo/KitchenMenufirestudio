import { Recipe, Ingredient, Category, UserStats } from '../types';

// Mock inventory data
export const inventoryData: Ingredient[] = [
  { id: "1", name: '西红柿', color: 'bg-red-400', amount: 4 },
  { id: "2", name: '鸡蛋', color: 'bg-yellow-200', amount: 8 },
  { id: "3", name: '虾仁', color: 'bg-orange-300', amount: 2 },
  { id: "4", name: '土豆', color: 'bg-yellow-600', amount: 5 },
  { id: "5", name: '洋葱', color: 'bg-purple-300', amount: 3 },
  { id: "6", name: '大蒜', color: 'bg-gray-200', amount: 10 },
  { id: "7", name: '油', color: 'bg-yellow-400', amount: 12 },
  { id: "8", name: '盐', color: 'bg-gray-100', amount: 15 },
  { id: "9", name: '胡椒', color: 'bg-gray-400', amount: 7 },
  { id: "10", name: '葱', color: 'bg-green-400', amount: 6 },
  { id: "11", name: '姜', color: 'bg-yellow-700', amount: 4 },
  { id: "12", name: '花生油', color: 'bg-yellow-500', amount: 9 }
];

// Mock recipes data
export const recipesData: Recipe[] = [
  {
    id: "1",
    name: '西红柿炒鸡蛋',
    weight: '300g',
    ingredients: ['西红柿', '鸡蛋', '油', '盐', '大蒜'],
    missing: [],
    prepTime: '5分钟',
    cookTime: '5分钟',
    totalTime: '10分钟',
    storage: '冷藏1天',
    difficulty: '简单',
    calories: 220,
    protein: '12g',
    fat: '15g',
    carbs: '8g',
    vitamins: 'A, C',
    minerals: '钾, 铁',
    favorite: true,
    rating: 4.8,
    reviewCount: 128,
    image: 'tomato-egg',
    tags: ['快手菜', '家常菜', '营养均衡'],
    description: '经典家常菜，酸甜可口，营养丰富，制作简单快捷。鲜嫩的鸡蛋与酸甜的西红柿完美结合，口感丰富，老少皆宜。',
    steps: [
      {
        step: 1,
        description: '准备食材：西红柿洗净切块，葱切葱花，大蒜切末',
        time: '2分钟',
        tip: '西红柿切成大小均匀的块状，便于均匀受热'
      },
      {
        step: 2,
        description: '打鸡蛋入碗中，加少许盐搅拌均匀',
        time: '1分钟',
        tip: '充分搅打可使蛋液更蓬松'
      },
      {
        step: 3,
        description: '热锅凉油，倒入蛋液，小火煎至半熟，用铲子划散成小块，盛出备用',
        time: '2分钟',
        tip: '鸡蛋不要煎得太老，保持嫩滑口感'
      },
      {
        step: 4,
        description: '锅中留底油，放入蒜末爆香，加入西红柿块翻炒至出汁',
        time: '2分钟',
        tip: '中火翻炒，让西红柿充分出汁但不至于太软'
      },
      {
        step: 5,
        description: '加入适量盐和白糖调味，倒入炒好的鸡蛋，大火快速翻炒均匀',
        time: '1分钟',
        tip: '加入白糖可以中和西红柿的酸味，使口感更加丰满'
      },
      {
        step: 6,
        description: '撒上葱花，出锅装盘即可',
        time: '1分钟',
        tip: '葱花最后放，保持香味和色彩'
      }
    ],
    tips: [
      '鸡蛋不要煎得太老，保持嫩滑口感',
      '可以根据个人口味调整酸甜度',
      '加入白糖可以中和西红柿的酸味，使口感更加丰满',
      '如果喜欢更浓郁的味道，可以加入少许蚝油'
    ],
    pairings: ['米饭', '馒头', '面条']
  },
  {
    id: "2",
    name: '香煎三文鱼',
    weight: '250g',
    ingredients: ['三文鱼', '橄榄油', '盐', '黑胡椒', '柠檬'],
    missing: ['三文鱼', '柠檬'],
    prepTime: '5分钟',
    cookTime: '10分钟',
    totalTime: '15分钟',
    storage: '不宜存放',
    difficulty: '中等',
    calories: 350,
    protein: '28g',
    fat: '22g',
    carbs: '0g',
    vitamins: 'D, B12',
    minerals: '钾, 硒',
    favorite: true,
    rating: 4.9,
    reviewCount: 86,
    image: 'salmon',
    tags: ['海鲜', '高蛋白', '低碳水'],
    description: '鲜嫩多汁的三文鱼，搭配简单的调味，完美保留了食材的原味。外皮酥脆，肉质鲜嫩，是一道营养价值极高的美味。',
    steps: [
      {
        step: 1,
        description: '三文鱼用厨房纸擦干水分，撒上适量盐和黑胡椒',
        time: '2分钟',
        tip: '擦干水分可以让煎制时更容易上色'
      },
      {
        step: 2,
        description: '平底锅中倒入适量橄榄油，中火加热',
        time: '1分钟',
        tip: '油温要适中，不要太热'
      },
      {
        step: 3,
        description: '放入三文鱼，皮朝下煎制至金黄色',
        time: '4分钟',
        tip: '不要频繁翻动，让鱼皮充分煎至酥脆'
      },
      {
        step: 4,
        description: '翻面继续煎制至七分熟',
        time: '3分钟',
        tip: '根据厚度调整时间，避免煎过头'
      },
      {
        step: 5,
        description: '装盘前挤上柠檬汁提味',
        time: '1分钟',
        tip: '柠檬汁可以中和鱼的腥味，提升口感'
      }
    ],
    tips: [
      '选择新鲜的三文鱼，肉质要紧实有弹性',
      '煎制时保持中火，避免外焦内生',
      '可以搭配芦笋或西兰花等绿色蔬菜',
      '建议七分熟，保持鱼肉的嫩滑口感'
    ],
    pairings: ['芦笋', '西兰花', '藜麦']
  },
  {
    id: "3",
    name: '炝炒土豆丝',
    weight: '250g',
    ingredients: ['土豆', '大蒜', '干辣椒', '油', '盐'],
    missing: ['干辣椒'],
    prepTime: '10分钟',
    cookTime: '5分钟',
    totalTime: '15分钟',
    storage: '冷藏2天',
    difficulty: '中等',
    calories: 180,
    protein: '3g',
    fat: '5g',
    carbs: '30g',
    vitamins: 'B6, C',
    minerals: '钾, 镁',
    favorite: false,
    rating: 4.5,
    reviewCount: 85,
    image: 'potato',
    tags: ['家常菜', '素食'],
    description: '香脆可口的经典家常菜，土豆丝炒制酥脆，微辣开胃，是下饭的好选择。',
    steps: [
      {
        step: 1,
        description: '土豆去皮，切成细丝，用冷水浸泡去除淀粉',
        time: '5分钟',
        tip: '土豆丝要切得均匀，这样才能保证受热一致'
      },
      {
        step: 2,
        description: '大蒜切末，干辣椒切段',
        time: '2分钟',
        tip: '蒜末不要太碎，避免容易焦糊'
      },
      {
        step: 3,
        description: '沥干土豆丝的水分',
        time: '1分钟',
        tip: '水分要沥干，否则不容易炒脆'
      },
      {
        step: 4,
        description: '热锅倒油，放入蒜末和干辣椒爆香',
        time: '1分钟',
        tip: '火候要快，避免蒜末焦糊'
      },
      {
        step: 5,
        description: '倒入土豆丝快速翻炒，加盐调味',
        time: '5分钟',
        tip: '保持大火快炒，这样土豆丝才会脆嫩'
      },
      {
        step: 6,
        description: '等土豆丝变软且略带焦边时，即可出锅',
        time: '1分钟',
        tip: '注意观察土豆丝的状态，不要炒过头'
      }
    ],
    tips: [
      '土豆丝切得越细越好，保证均匀熟透',
      '炒制过程中保持大火，使土豆丝快速脱水',
      '如果喜欢酸味，可以加入少许醋提味'
    ],
    pairings: ['米饭', '馒头']
  }
];

// Mock categories
export const categoriesData: Category[] = [
  { id: 1, name: '快手菜', color: 'bg-red-100 text-red-600', count: 18 },
  { id: 2, name: '低卡饮食', color: 'bg-blue-100 text-blue-600', count: 24 },
  { id: 3, name: '营养均衡', color: 'bg-yellow-100 text-yellow-600', count: 15 },
  { id: 4, name: '高蛋白', color: 'bg-purple-100 text-purple-600', count: 12 }
];

// Mock user stats
export const userStatsData: UserStats = {
  level: 3,
  exp: 65,
  nextLevel: 100,
  completedRecipes: 12,
  favoriteCuisine: '家常菜',
  weeklyPlan: 3
};