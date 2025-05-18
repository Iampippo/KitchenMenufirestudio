import React from 'react';
import { Award, Calendar, ChevronRight, Clock, Settings, ShoppingBag, Star, TrendingUp, FileText, LogOut } from 'lucide-react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { userStatsData } from '../data/mockData';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const UserProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('已成功退出登录');
      navigate('/login');
    } catch (error) {
      console.error('退出登录失败:', error);
      toast.error('退出登录失败，请重试');
    }
  };
  
  // 如果没有用户信息，显示提示
  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans pb-20 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-3">您尚未登录</h2>
          <p className="text-gray-600 mb-4">请先登录或注册一个账户</p>
          <button 
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm"
          >
            去登录
          </button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-20">
      {/* Header */}
      <Header title="我的" />
      
      {/* Main Content */}
      <main className="w-full max-w-3xl mx-auto px-4 py-4">
        {/* User Profile Card */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-24"></div>
          <div className="px-4 pb-4 relative">
            <div className="absolute -top-10 left-4 bg-white rounded-full p-1 shadow-md">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl">
                {user.email?.charAt(0).toUpperCase() || '用户'}
              </div>
            </div>
            <div className="pt-10">
              <h2 className="text-xl font-bold text-gray-800">{user.user_metadata?.username || user.email}</h2>
              <p className="text-sm text-gray-500 mt-1">自{new Date(user.created_at).getFullYear()}年以来的厨房小帮手用户</p>
              
              <div className="mt-3 flex items-center">
                <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs flex items-center">
                  <Award size={12} className="mr-1" />
                  料理等级 {userStatsData.level}
                </div>
                <div className="ml-2 bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs flex items-center">
                  <Star size={12} className="mr-1" />
                  已完成 {userStatsData.completedRecipes} 道菜
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div 
          className="mb-6 grid grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center text-indigo-500 mb-1">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm font-medium">本月烹饪</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">8 <span className="text-sm font-normal text-gray-500">道菜</span></p>
            <p className="text-xs text-green-500 mt-1">↑ 比上月增加了2道</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center text-purple-500 mb-1">
              <Clock size={16} className="mr-1" />
              <span className="text-sm font-medium">总烹饪时间</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">5.2 <span className="text-sm font-normal text-gray-500">小时</span></p>
            <p className="text-xs text-gray-500 mt-1">本月已在厨房度过</p>
          </div>
        </motion.div>
        
        {/* Menu Options */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="divide-y divide-gray-100">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Award size={20} className="text-indigo-500 mr-3" />
                <span className="text-gray-800">我的成就</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Calendar size={20} className="text-green-500 mr-3" />
                <span className="text-gray-800">我的烹饪日历</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <ShoppingBag size={20} className="text-amber-500 mr-3" />
                <span className="text-gray-800">食材管理</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FileText size={20} className="text-red-500 mr-3" />
                <span className="text-gray-800">我的食谱</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Settings size={20} className="text-gray-500 mr-3" />
                <span className="text-gray-800">设置</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={handleSignOut}
            >
              <div className="flex items-center">
                <LogOut size={20} className="text-red-500 mr-3" />
                <span className="text-red-500 font-medium">退出登录</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Next Level Progress */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">距离下一等级</h3>
            <span className="text-sm text-gray-500">{userStatsData.exp}/{userStatsData.nextLevel}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <motion.div 
              className="bg-indigo-500 h-3 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${(userStatsData.exp/userStatsData.nextLevel) * 100}%` }}
              transition={{ duration: 0.8 }}
            ></motion.div>
          </div>
          <p className="text-sm text-gray-600">再完成 <span className="font-medium text-indigo-600">{userStatsData.nextLevel - userStatsData.exp}</span> 点经验即可升级到 <span className="font-medium text-indigo-600">4级大厨</span></p>
          
          <div className="mt-3 bg-indigo-50 rounded-lg p-3">
            <p className="text-sm text-indigo-700">下一等级可解锁:</p>
            <ul className="text-xs text-gray-600 mt-1 space-y-1 list-disc list-inside">
              <li>高级菜谱推荐</li>
              <li>自定义菜谱功能</li>
              <li>厨师徽章</li>
            </ul>
          </div>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div 
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-800 mb-3">最近活动</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3 flex-shrink-0">
                <Award size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">完成了 <span className="font-medium">西红柿炒鸡蛋</span></p>
                <p className="text-xs text-gray-500 mt-0.5">2小时前</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3 flex-shrink-0">
                <Star size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">获得了成就 <span className="font-medium">家常菜大师 I</span></p>
                <p className="text-xs text-gray-500 mt-0.5">昨天</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3 flex-shrink-0">
                <ShoppingBag size={16} />
              </div>
              <div>
                <p className="text-sm text-gray-800">更新了食材库存</p>
                <p className="text-xs text-gray-500 mt-0.5">2天前</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default UserProfilePage;