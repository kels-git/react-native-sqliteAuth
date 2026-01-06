import React, { createContext, ReactNode, useContext, useState } from 'react';

interface loadingServicesProps {
  isloading: boolean;
  setIsloading: (loading: boolean) => void;
}

const loadingContext = createContext<loadingServicesProps | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isloading, setIsloading] = useState<boolean>(false);

  return <loadingContext.Provider value={{ isloading, setIsloading }}>{children}</loadingContext.Provider>;
};

export const useloading = () => {
  const context = useContext(loadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
