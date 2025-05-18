import React from 'react';
import Header from '../components/Header';
import LevelProgressCard from '../components/LevelProgressCard';
import BottomNavigation from '../components/BottomNavigation';

const LevelPage: React.FC = () => {
  const mockAchievements = {
    total: 50,
    completed: 12,
    recent: [
      {
        name: "初级厨师",
        description: "完成第一道料理",
        icon: "star",
        date: "2024-03-15"
      },
      {
        name: "家常菜大师",
        description: "完成10道家常菜",
        icon: "trophy",
        date: "2024-03-14"
      },
      {
        name: "食材收藏家",
        description: "收集20种食材",
        icon: "award",
        date: "2024-03-13"
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header title="等级成就" />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <LevelProgressCard
          currentLevel={3}
          currentExp={65}
          nextLevelExp={100}
          achievements={mockAchievements}
        />
      </main>

      <BottomNavigation />
    </div>
  );
};

export default LevelPage;