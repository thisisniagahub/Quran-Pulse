import React, { createContext, useContext } from 'react';

// This context is not actively used but is created to resolve build errors.
// In a larger application, this could be used to provide services
// like API clients or database helpers via React's context API,
// avoiding the need for direct imports in every component.

interface IServicesContext {
  // Define service types here in the future, e.g.
  // apiClient: ApiClient;
  // dbService: DbService;
}

const ServicesContext = createContext<IServicesContext | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize services here
  const services = {
    // apiClient: new ApiClient(),
    // dbService: new DbService(),
  };

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export const useServices = (): IServicesContext => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
};