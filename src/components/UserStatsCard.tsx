import React from 'react';
import { Award } from 'lucide-react';
import { UserStats } from '../types';
import { motion } from 'framer-motion';

interface UserStatsCardProps {
  stats: UserStats;
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ stats }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 shadow-md mb-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-medium">料理等级: {stats.level}</h3>
          <div className="w-full bg-white/30 rounded-full h-2 mt-1">
            <motion.div 
              className="bg-white h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.exp/stats.nextLevel) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            ></motion.div>
          </div>
          <p className="text-xs mt-1">再获得 {stats.nextLevel - stats.exp} 点经验升级!</p>
        </div>
        <motion.div 
          className="bg-white text-indigo-600 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {stats.level}
        </motion.div>
      </div>
      <div className="flex justify-between mt-3 text-xs">
        <div className="flex items-center">
          <Award size={14} className="mr-1" />
          <span>已完成料理: {stats.completedRecipes}</span>
        </div>
        <div>偏好菜系: {stats.favoriteCuisine}</div>
        <div>本周计划: {stats.weeklyPlan}/7</div>
      </div>
    </motion.div>
  );
};

export default UserStatsCard;