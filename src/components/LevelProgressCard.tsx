import React from 'react';
import { Star, Trophy, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelProgressCardProps {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
  achievements: {
    total: number;
    completed: number;
    recent: Array<{
      name: string;
      description: string;
      icon: 'star' | 'trophy' | 'award';
      date: string;
    }>;
  };
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  currentLevel,
  currentExp,
  nextLevelExp,
  achievements
}) => {
  const progressPercentage = (currentExp / nextLevelExp) * 100;
  const remainingExp = nextLevelExp - currentExp;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return <Star className="text-yellow-500" size={16} />;
      case 'trophy':
        return <Trophy className="text-amber-500" size={16} />;
      case 'award':
        return <Award className="text-indigo-500" size={16} />;
      default:
        return <Star className="text-yellow-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Level Progress Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">当前等级</h3>
            <p className="text-sm text-gray-500">继续加油，提升料理水平！</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{currentLevel}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">经验值进度</span>
            <span className="text-indigo-600 font-medium">{currentExp}/{nextLevelExp}</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            还需要 <span className="text-indigo-600 font-medium">{remainingExp}</span> 点经验升级
          </p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-indigo-800 mb-2">下一等级可解锁</h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-indigo-600">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2" />
              自定义菜谱功能
            </li>
            <li className="flex items-center text-sm text-indigo-600">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2" />
              高级食材搭配推荐
            </li>
            <li className="flex items-center text-sm text-indigo-600">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2" />
              专属徽章装饰
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">成就系统</h3>
          <span className="text-sm text-gray-500">
            {achievements.completed}/{achievements.total}
          </span>
        </div>

        <div className="space-y-4">
          {achievements.recent.map((achievement, index) => (
            <motion.div 
              key={achievement.name}
              className="flex items-start p-3 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mr-3">
                {getIcon(achievement.icon)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{achievement.name}</h4>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <p className="text-xs text-gray-400 mt-1">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition duration-200">
          查看全部成就
        </button>
      </motion.div>

      {/* Level Benefits Section */}
      <motion.div 
        className="bg-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">等级特权</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <Trophy size={16} className="text-green-600" />
            </div>
            <h4 className="font-medium text-green-800">专属食谱</h4>
            <p className="text-sm text-green-600 mt-1">解锁独特的限定菜谱</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <Star size={16} className="text-purple-600" />
            </div>
            <h4 className="font-medium text-purple-800">个性化推荐</h4>
            <p className="text-sm text-purple-600 mt-1">智能菜谱推荐系统</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <Award size={16} className="text-amber-600" />
            </div>
            <h4 className="font-medium text-amber-800">成就徽章</h4>
            <p className="text-sm text-amber-600 mt-1">展示您的烹饪成就</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Star size={16} className="text-blue-600" />
            </div>
            <h4 className="font-medium text-blue-800">社区特权</h4>
            <p className="text-sm text-blue-600 mt-1">参与美食社区互动</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelProgressCard;