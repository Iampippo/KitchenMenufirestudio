import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import InventoryPage from './pages/InventoryPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import ShoppingListPage from './pages/ShoppingListPage';
import UserProfilePage from './pages/UserProfilePage';
import LevelPage from './pages/LevelPage';
import RecipeListPage from './pages/RecipeListPage';
import CookingStepsPage from './pages/CookingStepsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { InventoryProvider } from './contexts/InventoryContext';
import { AuthProvider } from './contexts/AuthContext';
// 注释掉不存在的组件导入
// import KitchenAppFinal from './pages/KitchenAppFinal';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <InventoryProvider>
        <BrowserRouter>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 2000,
              style: {
                background: '#4B5563',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
              },
            }}
          />
          <Routes>
            {/* 公共路由 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* 暂时注释掉不存在的组件路由 */}
            {/* <Route path="/kitchen" element={<KitchenAppFinal />} /> */}
            
            {/* 需要身份验证的路由 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/level" element={<LevelPage />} />
              <Route path="/recipes" element={<RecipeListPage />} />
              <Route path="/recipe/:id/cook" element={<CookingStepsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </InventoryProvider>
    </AuthProvider>
  );
};

export default App;