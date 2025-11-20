import PropTypes from 'prop-types';
import {
  createContext,
  useMemo,
} from 'react';

import { useConsortiumLocations } from '../hooks';

export const ConsortiumLocationsContext = createContext();

const DEFAULT_OPTIONS = {};

export const ConsortiumLocationsContextProvider = ({
  children,
  options = DEFAULT_OPTIONS,
}) => {
  const {
    isFetching,
    isLoading,
    locations,
  } = useConsortiumLocations(options);

  const value = useMemo(() => ({
    isFetching,
    isLoading,
    locations,
  }), [isFetching, isLoading, locations]);

  return (
    <ConsortiumLocationsContext.Provider value={value}>
      {children}
    </ConsortiumLocationsContext.Provider>
  );
};

ConsortiumLocationsContextProvider.propTypes = {
  children: PropTypes.node,
  options: PropTypes.object,
};
