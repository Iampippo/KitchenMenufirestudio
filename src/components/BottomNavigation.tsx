import React from 'react';
import { ShoppingBag, Book, List, User, ShoppingCart, LogIn } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  
  const getActiveTab = () => {
    if (currentPath === '/') return 'home';
    if (currentPath === '/inventory') return 'inventory';
    if (currentPath.includes('/recipe') && !currentPath.includes('/recipes')) return 'recipes';
    if (currentPath === '/shopping-list') return 'shopping';
    if (currentPath === '/profile') return 'profile';
    if (currentPath === '/login') return 'login';
    return '';
  };
  
  const activeTab = getActiveTab();
  
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg">
      <div className="w-full max-w-3xl mx-auto flex justify-around">
        <button 
          className={`py-3 px-2 flex flex-col items-center ${activeTab === 'home' ? 'text-indigo-600' : 'text-gray-400'}`}
          onClick={() => navigate('/')}
        >
          <ShoppingBag size={18} />
          <span className="text-xs mt-1">食材库</span>
        </button>
        <button 
          className={`py-3 px-2 flex flex-col items-center ${activeTab === 'inventory' ? 'text-indigo-600' : 'text-gray-400'}`}
          onClick={() => navigate('/inventory')}
        >
          <List size={18} />
          <span className="text-xs mt-1">库存</span>
        </button>
        <button 
          className={`py-3 px-2 flex flex-col items-center ${activeTab === 'recipes' ? 'text-indigo-600' : 'text-gray-400'}`}
          onClick={() => navigate('/recipes')}
        >
          <Book size={18} />
          <span className="text-xs mt-1">菜谱</span>
        </button>
        <button 
          className={`py-3 px-2 flex flex-col items-center ${activeTab === 'shopping' ? 'text-indigo-600' : 'text-gray-400'}`}
          onClick={() => navigate('/shopping-list')}
        >
          <ShoppingCart size={18} />
          <span className="text-xs mt-1">购物清单</span>
        </button>
        {user ? (
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'profile' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => navigate('/profile')}
          >
            <User size={18} />
            <span className="text-xs mt-1">我的</span>
          </button>
        ) : (
          <button 
            className={`py-3 px-2 flex flex-col items-center ${activeTab === 'login' ? 'text-indigo-600' : 'text-gray-400'}`}
            onClick={() => navigate('/login')}
          >
            <LogIn size={18} />
            <span className="text-xs mt-1">登录/注册</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default BottomNavigation;