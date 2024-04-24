import PropTypes from 'prop-types';
import { createContext } from 'react';

import { useLocations } from '../hooks';

export const LocationsContext = createContext();

export const LocationsContextProvider = ({ children }) => {
  const { isLoading, locations } = useLocations();

  return (
    <LocationsContext.Provider value={{ locations, isLoading }}>
      {children}
    </LocationsContext.Provider>
  );
};

LocationsContextProvider.propTypes = {
  children: PropTypes.node,
};
