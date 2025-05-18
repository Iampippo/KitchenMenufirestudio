import React from 'react';
import { Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface CookingTipProps {
  title: string;
  content: string;
}

const CookingTip: React.FC<CookingTipProps> = ({ title, content }) => {
  return (
    <motion.div 
      className="mt-6 bg-indigo-50 rounded-xl p-4 shadow-sm border border-indigo-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
          <Book size={18} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium text-indigo-800">{title}</h3>
          <p className="text-xs text-gray-600 mt-1">{content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CookingTip;