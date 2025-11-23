import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';
import BgSelector from '../BgSelector';
import { config } from '../../config/env';
import { loadInitialBgData, setBgUrl } from '../../features/bgSlice';

export default function DefaultLayout() {
  const dispatch = useDispatch();
  const bgUrl = useSelector((state) => state.bg.bgUrl);
  const [showBgSelector, setShowBgSelector] = useState(false);

  // Load initial background data from Redux/localStorage
  useEffect(() => {
    dispatch(loadInitialBgData());
  }, [dispatch]);

  const handleSelectBg = (url) => {
    dispatch(setBgUrl(url));
    setShowBgSelector(false);
  };

  const handleResetBg = () => {
    dispatch(setBgUrl(null));
    setShowBgSelector(false);
  };

  const getBackgroundStyle = () => {
    if (!bgUrl) return {};
    return {
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    };
  };

  return (
    <div className="flex min-h-screen dark:bg-gray-700 dark:text-amber-50">
      <Sidebar onOpenBgSelector={() => setShowBgSelector(true)} />

      <div 
        className="flex-1 p-4 bg-amber-50 dark:bg-gray-500 relative"
        style={getBackgroundStyle()}
      >
       
        {bgUrl && (
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        )}
        
       
        <div className="relative z-10">
          <Outlet />  
        </div>
      </div>

      {showBgSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <BgSelector
            onSelect={handleSelectBg}
            onClose={() => setShowBgSelector(false)}
            onReset={handleResetBg}
            unsplashAccessKey={config.UNSPLASH_KEY}
          />
        </div>
      )}
    </div>
  )
}
