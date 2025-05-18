import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Check, ChevronDown, ChevronUp, AlertCircle, PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipesData } from '../data/mockData';

const CookingStepsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // Find the recipe by ID
  const recipe = recipesData.find(r => r.id === Number(id));
  
  // If recipe not found, redirect to recipes page
  useEffect(() => {
    if (!recipe) {
      navigate('/recipes');
    }
  }, [recipe, navigate]);
  
  // 各步骤的计时状态
  const [timers, setTimers] = useState(
    recipe?.steps.map(() => ({ active: false, elapsed: 0 })) || []
  );
  
  // 设置正计时器逻辑
  useEffect(() => {
    const timerIntervals = timers.map((timer, index) => {
      if (timer.active) {
        return setInterval(() => {
          setTimers(prevTimers => {
            const newTimers = [...prevTimers];
            newTimers[index].elapsed += 1;
            return newTimers;
          });
        }, 1000);
      }
      return null;
    });
    
    return () => {
      timerIntervals.forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [timers]);
  
  if (!recipe) {
    return null;
  }
  
  // 选择步骤
  const handleSelectStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    
    const previousSteps = [];
    for (let i = 0; i < stepIndex; i++) {
      if (!completedSteps.includes(i)) {
        previousSteps.push(i);
      }
    }
    
    if (previousSteps.length > 0) {
      setCompletedSteps([...completedSteps, ...previousSteps]);
    }
    
    if (!timers[stepIndex].active) {
      toggleTimer(stepIndex);
    }
    
    window.scrollTo(0, 0);
  };
  
  // 标记步骤完成
  const markStepCompleted = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    } else {
      setCompletedSteps(completedSteps.filter(step => step !== stepIndex));
    }
  };
  
  // 切换计时器状态
  const toggleTimer = (index: number) => {
    const newTimers = [...timers];
    newTimers.forEach((timer, i) => {
      if (i !== index) {
        timer.active = false;
      }
    });
    newTimers[index].active = !newTimers[index].active;
    setTimers(newTimers);
  };
  
  // 重置计时器
  const resetTimer = (index: number) => {
    const newTimers = [...timers];
    newTimers[index].elapsed = 0;
    newTimers[index].active = false;
    setTimers(newTimers);
  };
  
  // 格式化时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  // 导航控制
  const goToNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      handleSelectStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = () => {
    if (currentStep > 0) {
      handleSelectStep(currentStep - 1);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* 顶部导航栏 */}
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <button className="mr-3" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800 flex-1">{recipe.name}</h1>
        <div className="flex items-center text-gray-500">
          <Clock size={16} className="mr-1" />
          <span className="text-sm">{recipe.totalTime}</span>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="p-4">
        {/* 步骤列表 */}
        <div className="space-y-4 mb-20">
          {recipe.steps.map((step, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl border ${
                index === currentStep 
                  ? 'border-indigo-200 ring-1 ring-indigo-100' 
                  : 'border-gray-100'
              } shadow-sm overflow-hidden`}
              onClick={() => handleSelectStep(index)}
            >
              <div className="px-5 py-4">
                <div className="flex items-start">
                  {/* 步骤编号和完成状态 */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-medium mr-3 ${
                    completedSteps.includes(index)
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {completedSteps.includes(index) ? <Check size={16} /> : step.step}
                  </div>
                  
                  {/* 步骤描述 */}
                  <div className="flex-1">
                    <h2 
                      className={`text-base font-medium ${
                        completedSteps.includes(index) ? 'text-gray-400 line-through' : 'text-gray-800'
                      } cursor-pointer hover:text-indigo-600`}
                      onClick={(e) => {
                        e.stopPropagation();
                        markStepCompleted(index);
                      }}
                    >
                      {step.description}
                    </h2>
                  </div>
                  
                  {/* 时间和计时器 */}
                  <div className="ml-3 flex items-center">
                    <div className="text-sm text-gray-500 mr-2">{step.time}</div>
                    
                    {/* 计时器显示和控制 */}
                    <div className="flex items-center">
                      {timers[index].active ? (
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-indigo-600 mr-2">
                            {formatTime(timers[index].elapsed)}
                          </div>
                          <PauseCircle 
                            size={18} 
                            className="text-indigo-600 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTimer(index);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center">
                          {timers[index].elapsed > 0 && (
                            <div className="text-sm text-gray-500 mr-2">
                              {formatTime(timers[index].elapsed)}
                            </div>
                          )}
                          <PlayCircle 
                            size={18} 
                            className="text-gray-400 hover:text-indigo-600 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTimer(index);
                            }}
                          />
                        </div>
                      )}
                      
                      {timers[index].elapsed > 0 && (
                        <RotateCcw 
                          size={14} 
                          className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            resetTimer(index);
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 勾选按钮 */}
                <div className="flex justify-end mt-1">
                  <button 
                    className={`text-xs py-1 px-2 rounded-full flex items-center ${
                      completedSteps.includes(index) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      markStepCompleted(index);
                    }}
                  >
                    <Check size={12} className="mr-1" />
                    {completedSteps.includes(index) ? '已完成' : '标记完成'}
                  </button>
                </div>
              </div>
              
              {/* 步骤提示 */}
              {index === currentStep && (
                <div className="bg-amber-50 px-5 py-3 border-t border-amber-100">
                  <div className="flex">
                    <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mr-2 mt-0.5" />
                    <div className="text-sm text-amber-700">
                      <span className="font-medium">小贴士：</span>
                      {step.tip}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      
      {/* 底部操作栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="flex justify-between">
          <button 
            className={`px-4 py-2 rounded-lg border border-gray-300 ${
              currentStep === 0 ? 'text-gray-300' : 'text-gray-700'
            } flex items-center`}
            onClick={goToPrevStep}
            disabled={currentStep === 0}
          >
            <ChevronUp size={18} className="mr-1" />
            上一步
          </button>
          
          <button 
            className={`px-4 py-2 rounded-lg flex items-center ${
              completedSteps.includes(currentStep)
                ? 'bg-green-500 text-white'
                : 'bg-indigo-600 text-white'
            }`}
            onClick={() => {
              markStepCompleted(currentStep);
              if (currentStep < recipe.steps.length - 1) {
                goToNextStep();
              }
            }}
          >
            {completedSteps.includes(currentStep) ? (
              <>
                <Check size={18} className="mr-1" />
                {currentStep === recipe.steps.length - 1 ? '完成' : '下一步'}
              </>
            ) : (
              <>
                <Check size={18} className="mr-1" />
                {currentStep === recipe.steps.length - 1 ? '完成烹饪' : '完成并继续'}
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CookingStepsPage;