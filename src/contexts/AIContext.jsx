import React, { createContext, useContext, useState } from 'react';

const AIContext = createContext();

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

export const AIProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [aiStatus, setAiStatus] = useState('idle');
  const [insights, setInsights] = useState({});

  const value = {
    conversations,
    aiStatus,
    insights,
    setConversations,
    setAiStatus,
    setInsights,
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};
