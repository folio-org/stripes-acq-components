import { createContext } from 'react';

import { useConsortiumLocations } from '../../hooks';

export const FundConsortiumLocationsContext = createContext();

export const FundConsortiumLocationsContextProvider = ({ children }) => {
  const { locations, isLoading } = useConsortiumLocations();

  return (
    <FundConsortiumLocationsContext.Provider value={{ locations, isLoading }}>
      {children}
    </FundConsortiumLocationsContext.Provider>
  );
};
