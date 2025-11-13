
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Türkçe Haberler
        </h1>
        <div className="text-sm font-medium text-cyan-400">
          Gemini API ile güçlendirilmiştir
        </div>
      </div>
    </header>
  );
};
