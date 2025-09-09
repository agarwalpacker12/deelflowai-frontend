import React from 'react';
import { useSelector } from 'react-redux';
import { selectLoading } from '../../store/slices/uiSlice';

const LoadingSpinner = () => {
  const loading = useSelector(selectLoading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="text-white font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
