import PropTypes from 'prop-types';
import {
  createContext,
  useContext,
  useMemo,
} from 'react';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';

import { useCentralOrderingSettings } from '../hooks';

export const CentralOrderingContext = createContext();

export const useCentralOrderingContext = () => useContext(CentralOrderingContext);

export const CentralOrderingContextProvider = ({
  centralTenantOnly = false,
  children,
  throwOnError = false,
}) => {
  const stripes = useStripes();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const { enabled } = useCentralOrderingSettings({
    enabled: centralTenantOnly ? isUserInCentralTenant : true,
    suspense: true,
    useErrorBoundary: throwOnError,
  });

  const value = useMemo(() => ({
    isCentralOrderingEnabled: centralTenantOnly ? (isUserInCentralTenant && enabled) : enabled,
  }), [centralTenantOnly, enabled, isUserInCentralTenant]);

  return (
    <CentralOrderingContext.Provider value={value}>
      {children}
    </CentralOrderingContext.Provider>
  );
};

CentralOrderingContextProvider.propTypes = {
  centralTenantOnly: PropTypes.bool,
  children: PropTypes.node,
  throwOnError: PropTypes.bool,
};
