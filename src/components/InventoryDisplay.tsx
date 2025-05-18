import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { motion } from 'framer-motion';

const InventoryDisplay: React.FC = () => {
  const navigate = useNavigate();
  const { inventory } = useInventory();
  
  // 计算食材数量的最大值，用于进度条宽度
  const maxAmount = Math.max(...inventory.map(item => item.amount));
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">您的食材库存</h2>
        <button 
          className="text-sm text-indigo-600 flex items-center hover:text-indigo-700 transition duration-200"
          onClick={() => navigate('/inventory')}
        >
          管理库存 <Plus size={16} className="ml-1" />
        </button>
      </div>
      
      <motion.div 
        className="bg-white rounded-xl p-4 shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {inventory.length > 0 ? (
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            {inventory.map((item) => (
              <motion.div 
                key={item.id} 
                className="flex items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div 
                  className={`h-5 rounded ${item.color} transition-all duration-500 ease-out`} 
                  style={{ 
                    width: `${(item.amount / maxAmount) * 80}%`, 
                    minWidth: '15px', 
                    maxWidth: '50px' 
                  }}
                ></div>
                <span className="text-sm text-gray-700 ml-2 truncate">{item.name} ({item.amount})</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">暂无库存，点击右上角添加食材</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InventoryDisplay;