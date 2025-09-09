import React, { createContext, useContext, useState } from 'react';

const PsychologyContext = createContext();

export const usePsychology = () => {
  const context = useContext(PsychologyContext);
  if (!context) {
    throw new Error('usePsychology must be used within a PsychologyProvider');
  }
  return context;
};

export const PsychologyProvider = ({ children }) => {
  const [behaviorData, setBehaviorData] = useState({});
  const [triggers, setTriggers] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const value = {
    behaviorData,
    triggers,
    analytics,
    setBehaviorData,
    setTriggers,
    setAnalytics,
  };

  return (
    <PsychologyContext.Provider value={value}>
      {children}
    </PsychologyContext.Provider>
  );
};
