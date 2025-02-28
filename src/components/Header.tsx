"use client";

import { MoonIcon, SunIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { usePageTitle } from '@/lib/context/PageTitleContext';

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const { pageTitle } = usePageTitle();

  useEffect(() => {
    // Check system preference on mount
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(darkModePreference);

    // Add dark class to html element
    document.documentElement.classList.toggle('dark', darkModePreference);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 h-12 flex items-center px-3 z-40 shrink-0 sticky top-0">
      <div className="flex-1 flex items-center">
        <span className="text-sm font-semibold mr-3">Campaign Manager - {pageTitle}</span>
        
        {/* CRM Connection Status Indicators */}
        <div className="flex items-center gap-2 mr-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium">SF</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-medium">HS</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span className="text-xs font-medium">Clay</span>
          </div>
        </div>
        
        <div className="h-5 border-l border-gray-200 dark:border-gray-700 mx-2" />
        
        <div className="flex items-center gap-3 text-xs overflow-x-auto whitespace-nowrap">
          <span className="text-gray-500 dark:text-gray-400 font-medium">Filters:</span>
          <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">Dec 31 - Feb 24</span>
          <button className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Today</button>
          <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">$25M Budget</span>
          <div className="flex items-center gap-1">
            <ChartBarIcon className="w-3 h-3 text-indigo-500" />
            <span>154/842 Campaigns</span>
          </div>
          <span>2,847 MQLs</span>
          <span>84,521 Meetings</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="px-2 py-0.5 rounded text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors">
            Load Data
          </button>
          <button 
            onClick={toggleDarkMode}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? (
              <SunIcon className="w-3.5 h-3.5" />
            ) : (
              <MoonIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
} 