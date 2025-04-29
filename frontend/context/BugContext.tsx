// /contexts/BugContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface BugContextType {
  bugs: any[];
  setBugs: React.Dispatch<React.SetStateAction<any[]>>;
}

const BugContext = createContext<BugContextType | undefined>(undefined);

export const useBugContext = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider');
  }
  return context;
};

export const BugProvider: React.FC = ({ children }) => {
  const [bugs, setBugs] = useState<any[]>([]);

  return (
    <BugContext.Provider value={{ bugs, setBugs }}>
      {children}
    </BugContext.Provider>
  );
};
