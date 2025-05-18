import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500"></div>
      </div>
    );
  }

  // 如果没有登录，重定向到登录页面
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 如果已登录，显示子路由
  return <Outlet />;
};

export default ProtectedRoute; 