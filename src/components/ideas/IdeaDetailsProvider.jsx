import React, { createContext, useContext, useState } from "react";

const IdeaDetailsContext = createContext();

export const useIdeaDetailsContext = () => {
  const context = useContext(IdeaDetailsContext);
  if (!context) {
    throw new Error("useIdeaDetailsContext must be used within a IdeaDetailsProvider");
  }
  return context;
};

export default function IdeaDetailsProvider({ children }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <IdeaDetailsContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </IdeaDetailsContext.Provider>
  );
}
