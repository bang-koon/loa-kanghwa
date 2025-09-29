"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type View = "reward" | "calculator";

interface ViewContextType {
  activeView: View;
  setActiveView: (view: View) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: ReactNode }) => {
  const [activeView, setActiveView] = useState<View>("reward");

  return (
    <ViewContext.Provider value={{ activeView, setActiveView }} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};
