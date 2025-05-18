import React from 'react';
import { User, Filter, ArrowLeft, Share2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showFilter?: boolean;
  onFilterToggle?: () => void;
  isDetailPage?: boolean;
  onBackClick?: () => void;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showFilter = false, 
  onFilterToggle,
  isDetailPage = false,
  onBackClick,
  isFavorite = false,
  onFavoriteToggle
}) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="w-full max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
        {isDetailPage ? (
          // Detail page header
          <div className="flex items-center">
            <button className="mr-3" onClick={onBackClick || (() => navigate(-1))}>
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
          </div>
        ) : (
          // Main header
          <h1 className="text-lg font-bold text-indigo-700">{title}</h1>
        )}
        <div className="flex items-center gap-3">
          {isDetailPage ? (
            <>
              <button className="text-gray-500">
                <Share2 size={18} />
              </button>
              <button 
                className={isFavorite ? "text-red-500" : "text-gray-400"}
                onClick={onFavoriteToggle}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </>
          ) : (
            <>
              {showFilter && (
                <button 
                  className="bg-gray-100 p-2 rounded-full"
                  onClick={onFilterToggle}
                >
                  <Filter size={18} className="text-gray-500" />
                </button>
              )}
              <button 
                className="bg-gray-100 p-2 rounded-full"
                onClick={() => navigate('/profile')}
              >
                <User size={18} className="text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;