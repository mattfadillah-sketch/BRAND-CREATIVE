
import React from 'react';
import { OutputMode } from '../types';

interface TabsProps {
  activeTab: OutputMode;
  setActiveTab: (tab: OutputMode) => void;
}

const tabOptions = [
  OutputMode.VisualPrompt,
  OutputMode.VideoScript,
  OutputMode.ContentPlanner,
];

export const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md bg-gray-900 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 text-white"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as OutputMode)}
        >
          {tabOptions.map((tab) => (
            <option key={tab}>{tab}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
            {tabOptions.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  tab === activeTab
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
