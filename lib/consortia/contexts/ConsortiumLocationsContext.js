import PropTypes from 'prop-types';
import { createContext } from 'react';

import { useConsortiumLocations } from '../../hooks';

export const ConsortiumLocationsContext = createContext();

export const ConsortiumLocationsContextProvider = ({
  children,
  options,
}) => {
  const { locations, isLoading } = useConsortiumLocations(options);

  return (
    <ConsortiumLocationsContext.Provider value={{ locations, isLoading }}>
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
