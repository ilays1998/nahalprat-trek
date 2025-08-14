import React, { useState, createContext, useContext } from 'react';

const TabsContext = createContext();

export function Tabs({ children, defaultValue, className = "", ...props }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsContent({ children, value, className = "", ...props }) {
  const { activeTab } = useContext(TabsContext);
  
  if (activeTab !== value) return null;
  
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ children, value, className = "", ...props }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        isActive
          ? 'border-amber-500 text-amber-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } ${className}`}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
} 