// context/KnowledgeGraphContext.js
import React, { createContext, useState, useContext } from 'react';

const KnowledgeGraphContext = createContext();

export const KnowledgeGraphProvider = ({ children }) => {
  const [realmData, setRealmData] = useState([]); // Initialize state for realm data

  return (
    <KnowledgeGraphContext.Provider value={{ realmData, setRealmData }}>
      {children}
    </KnowledgeGraphContext.Provider>
  );
};

// Custom hook to use the context in other components
export const useKnowledgeGraph = () => useContext(KnowledgeGraphContext);
