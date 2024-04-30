import PropTypes from 'prop-types';
import {
  createContext,
  useMemo,
} from 'react';

import { useConsortiumLocations } from '../../hooks';

export const ConsortiumLocationsContext = createContext();

export const ConsortiumLocationsContextProvider = ({
  children,
  options,
}) => {
  const { locations, isLoading } = useConsortiumLocations(options);

  const value = useMemo(() => ({ locations, isLoading }), [locations, isLoading]);

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
