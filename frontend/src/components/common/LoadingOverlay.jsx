import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="flex items-center justify-center z-[999999999] bg-black opacity-50 fixed top-0 right-0 bottom-0 left-0">
      <div className="w-16 h-16 border-4 border-solid border-gray-200 border-t-blue-600 animate-spin rounded-[50%]"></div>
    </div>
  );
};

export default LoadingOverlay;
