import React from 'react';

const LoadingSpinner = ({ fullScreen = false, message = '로딩 중...' }) => {
  const spinnerContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-transparent border-t-red-600 rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="w-full h-[450px] flex items-center justify-center">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;