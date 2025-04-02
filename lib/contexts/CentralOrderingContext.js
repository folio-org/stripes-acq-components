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

const QUERY_KEY = 'central-ordering-context';

export const CentralOrderingContext = createContext();

export const useCentralOrderingContext = () => useContext(CentralOrderingContext);

export const CentralOrderingContextProvider = ({
  centralTenantOnly = false,
  children,
  suspense = true,
  throwOnError = false,
}) => {
  const stripes = useStripes();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const { enabled } = useCentralOrderingSettings({
    enabled: centralTenantOnly ? isUserInCentralTenant : true,
    queryKey: [QUERY_KEY],
    suspense,
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
  suspense: PropTypes.bool,
  throwOnError: PropTypes.bool,
};
