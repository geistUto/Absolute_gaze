
import React, { createContext, useContext, useState } from 'react';

const SnippetsContext = createContext();

export const SnippetsProvider = ({ children }) => {
  const [snippets, setSnippets] = useState([]);

  const addSnippet = (newSnippet) => {
    setSnippets((prevSnippets) => [...prevSnippets, newSnippet]);
  };

  return (
    <SnippetsContext.Provider value={{ snippets,  addSnippet,setSnippets }}>
      {children}
    </SnippetsContext.Provider>
  );
};

export const useSnippets = () => useContext(SnippetsContext);
