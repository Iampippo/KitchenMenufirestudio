import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, Session, User, AuthResponse, AuthError } from '@supabase/supabase-js';

// 创建Supabase客户端
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fisrtghcvoxnznkysjsl.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpc3J0Z2hjdm94bnpua3lzanNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMTIyNDEsImV4cCI6MjA2MjU4ODI0MX0.nMXJf4eKJCke_pdnQNogp-gwk5U1HYTMuotwSdWKRlw';

export const supabase = createClient(supabaseUrl, supabaseKey);

// 初始库存食材列表
const initialIngredients = [
  { name: '盐', color: 'bg-gray-100', amount: 15 },
  { name: '油', color: 'bg-yellow-400', amount: 12 },
  { name: '胡椒', color: 'bg-gray-400', amount: 7 },
  { name: '大蒜', color: 'bg-gray-200', amount: 10 },
  { name: '葱', color: 'bg-green-400', amount: 6 }
];

// 定义上下文类型
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, username: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any, error: AuthError | null }>;
};

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 提供者组件
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取当前会话
    const getSession = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    getSession();

    // 设置身份验证变化监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 登录方法
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  // 为新用户添加初始食材库存
  const addInitialIngredients = async (userId: string) => {
    try {
      // 获取系统食材信息
      const systemUserId = '00000000-0000-0000-0000-000000000000';
      const { data: systemIngredients } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', systemUserId);

      if (!systemIngredients || systemIngredients.length === 0) {
        console.error('未找到系统食材数据');
        return;
      }

      // 准备插入用户初始食材库存
      const userIngredients = initialIngredients.map(ingredient => {
        // 查找对应的系统食材
        const systemIngredient = systemIngredients.find(sysIng => sysIng.name === ingredient.name);
        if (!systemIngredient) {
          return {
            name: ingredient.name,
            color: ingredient.color,
            amount: ingredient.amount,
            user_id: userId
          };
        }
        return {
          name: systemIngredient.name,
          color: systemIngredient.color,
          amount: ingredient.amount,
          user_id: userId
        };
      });

      // 插入用户初始食材库存
      const { error } = await supabase.from('ingredients').insert(userIngredients);
      
      if (error) {
        console.error('添加初始食材失败:', error);
      } else {
        console.log('成功添加初始食材库存');
      }
    } catch (error) {
      console.error('添加初始食材库存时出错:', error);
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string, username: string) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    // 如果注册成功，创建用户统计信息
    if (response.data.user && !response.error) {
      try {
        // 创建用户统计信息
        await supabase.from('user_stats').insert({
          user_id: response.data.user.id,
          level: 1,
          exp: 0,
          next_level: 100,
          completed_recipes: 0,
          weekly_plan: 0
        });
        
        // 添加初始食材库存
        await addInitialIngredients(response.data.user.id);
      } catch (error) {
        console.error('创建用户初始数据时出错:', error);
      }
    }

    return response;
  };

  // 退出登录方法
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // 重置密码方法
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 自定义钩子，方便使用上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 