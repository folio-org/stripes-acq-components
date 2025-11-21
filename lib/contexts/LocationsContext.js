import PropTypes from 'prop-types';
import {
  createContext,
  useMemo,
} from 'react';

import { useLocations } from '../hooks';

export const LocationsContext = createContext();

const DEFAULT_OPTIONS = {};

export const LocationsContextProvider = ({
  children,
  options = DEFAULT_OPTIONS,
}) => {
  const {
    isFetching,
    isLoading,
    locations,
  } = useLocations(options);

  const value = useMemo(() => ({
    isFetching,
    isLoading,
    locations,
  }), [isFetching, isLoading, locations]);

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
