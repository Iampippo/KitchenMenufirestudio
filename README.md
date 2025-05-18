# 厨房助手应用

一个帮助用户管理厨房库存、查找菜谱、制作美食的应用程序。

## 功能特点

- **用户认证系统**：注册、登录和密码重置
- **食材库存管理**：添加、删除和更新食材库存
- **菜谱推荐**：根据用户当前食材库存推荐可以烹饪的菜谱
- **菜谱详情**：提供详细的步骤说明、烹饪技巧和食材清单
- **购物清单**：帮助用户记录需要购买的食材
- **用户等级系统**：烹饪菜谱获得经验值，提升用户等级
- **数据持久化**：使用Supabase数据库存储用户数据

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase（后端服务和数据库）
- React Router（路由管理）
- Framer Motion（动画效果）

## 本地开发

1. 克隆项目
```
git clone <repository-url>
```

2. 安装依赖
```
npm install
```

3. 创建`.env`文件，添加Supabase配置
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

4. 启动开发服务器
```
npm run dev
```

5. 构建生产版本
```
npm run build
```

## 数据库结构

项目使用Supabase数据库，主要表结构包括：

- `ingredients`：存储食材及其库存
- `recipes`：存储菜谱基本信息
- `recipe_steps`：存储菜谱步骤
- `recipe_tags`：存储菜谱标签
- `recipe_tips`：存储菜谱烹饪提示
- `recipe_pairings`：存储菜谱搭配建议
- `recipe_ingredients`：存储菜谱所需食材
- `user_stats`：存储用户统计信息（等级、经验值等）
- `shopping_list`：存储购物清单

## 待实现功能

- 菜谱评分和评论系统
- 个性化推荐算法优化
- 周计划和每日食谱
- 食品营养信息分析
