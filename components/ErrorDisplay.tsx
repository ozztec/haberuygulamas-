
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative my-8 max-w-2xl mx-auto" role="alert">
      <strong className="font-bold">Hata!</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  );
};
