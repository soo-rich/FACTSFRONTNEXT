'use client';

import React from 'react';
import CircularProgress from '@/components/ui/progress/circularprogress';

const LoadingWithoutModal = ({ message = 'Chargement en cours...', padding = 'p-36' }) => {
  return (
    <div className={`flex flex-col items-center p-36 justify-items-center ${padding}`}>
      <CircularProgress size={40} strokeWidth={2} />
      <span className={'mt-2 text-xl font-semibold'}>{message}</span>
    </div>
  );
};

export default LoadingWithoutModal;
