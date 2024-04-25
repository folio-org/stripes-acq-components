import PropTypes from 'prop-types';
import { createContext } from 'react';

import { useLocations } from '../hooks';

export const LocationsContext = createContext();

export const LocationsContextProvider = ({
  children,
  options,
}) => {
  const { isLoading, locations } = useLocations(options);

  return (
    <LocationsContext.Provider value={{ locations, isLoading }}>
      {children}
    </LocationsContext.Provider>
  );
};

LocationsContextProvider.propTypes = {
  children: PropTypes.node,
  options: PropTypes.object,
};

LocationsContextProvider.defaultProps = {
  options: {},
};
