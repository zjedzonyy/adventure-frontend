import { createContext, useContext, useState } from "react";

const SocialContext = createContext();

export const useSocialContext = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error("useSocialContext must be used within a SocialProvider");
  }
  return context;
};

export const SocialProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <SocialContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </SocialContext.Provider>
  );
};
