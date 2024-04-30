import PropTypes from 'prop-types';
import {
  createContext,
  useMemo,
} from 'react';

import { useLocations } from '../hooks';

export const LocationsContext = createContext();

export const LocationsContextProvider = ({
  children,
  options,
}) => {
  const { isLoading, locations } = useLocations(options);

  const value = useMemo(() => ({ locations, isLoading }), [locations, isLoading]);

  return (
    <LocationsContext.Provider value={value}>
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
