import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import {
  getHoldingsAndLocations,
  getHoldingsAndLocationsByTenants,
} from '../../utils';

const DEFAULT_DATA = [];

/*
  The purpose of this hook is to fetch holdings and locations for a given instanceId
  and tenants when we need to fetch locations from other tenants when Central ordering is enabled.
*/
export const useTenantHoldingsAndLocations = ({
  instanceId,
  options = {},
  tenantId,
  /*
   `receivingTenantIds` is a unique list of tenantIds from the pieces list.
    The purpose is that we need to be able to fetch locations from other
    tenants so that we can display all the locations on the full-screen page
  */
  receivingTenantIds = DEFAULT_DATA,
  /*
    ECS mode:
    `additionalTenantLocationIdsMap` is a map of tenantId to locationIds for ECS mode.
    The format can be: { tenantId: [locationId1, locationId2] }
    The purpose is that we need to fetch newly added locations when we select a location
    from "Create new holdings for location" modal so that the value is displayed in the selection
  */
  additionalTenantLocationIdsMap = {},
  /*
    Non-ECS mode:
    `additionalLocationIds` is a list of locationIds for the case when we need to fetch additional
    locations for the selected location in the form so that the value is displayed in the selection.
  */
  additionalLocationIds = [],
}) => {
  const { enabled = true, ...queryOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'holdings-and-location' });
  const queryKey = [
    namespace,
    tenantId,
    instanceId,
    ...receivingTenantIds,
    ...additionalLocationIds,
    ...Object.values(additionalTenantLocationIdsMap),
  ];
  const searchParams = {
    query: `instanceId==${instanceId}`,
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey,
    queryFn: ({ signal }) => {
      return receivingTenantIds.length
        ? getHoldingsAndLocationsByTenants({ ky, instanceId, receivingTenantIds, additionalTenantLocationIdsMap })
        : getHoldingsAndLocations({ ky, searchParams, signal, additionalLocationIds });
    },
    enabled: enabled && Boolean(instanceId),
    ...queryOptions,
  });

  return ({
    holdings: data?.holdings || DEFAULT_DATA,
    locations: data?.locations || DEFAULT_DATA,
    locationIds: data?.locationIds || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
