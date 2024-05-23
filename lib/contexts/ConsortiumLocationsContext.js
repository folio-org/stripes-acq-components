import PropTypes from 'prop-types';
import {
  createContext,
  useMemo,
} from 'react';

import { useConsortiumLocations } from '../hooks';

export const ConsortiumLocationsContext = createContext();

export const ConsortiumLocationsContextProvider = ({
  children,
  options,
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

ConsortiumLocationsContextProvider.defaultProps = {
  options: {},
};
