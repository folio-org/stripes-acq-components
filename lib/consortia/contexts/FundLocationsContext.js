import { createContext } from 'react';

import { useLocations } from '../../hooks';

export const FundLocationsContext = createContext();

export const FundLocationsContextProvider = ({ children }) => {
  const { isLoading, locations } = useLocations();

  return (
    <FundLocationsContext.Provider value={{ locations, isLoading }}>
      {children}
    </FundLocationsContext.Provider>
  );
};
