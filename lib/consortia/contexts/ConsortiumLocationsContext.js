import PropTypes from 'prop-types';
import { createContext } from 'react';

import { useConsortiumLocations } from '../../hooks';

export const ConsortiumLocationsContext = createContext();

export const ConsortiumLocationsContextProvider = ({ children }) => {
  const { locations, isLoading } = useConsortiumLocations();

  return (
    <ConsortiumLocationsContext.Provider value={{ locations, isLoading }}>
      {children}
    </ConsortiumLocationsContext.Provider>
  );
};

ConsortiumLocationsContextProvider.propTypes = {
  children: PropTypes.node,
};
