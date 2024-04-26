import queryString from 'query-string';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LOCATIONS_API } from '../../constants';
import { fetchAllRecords } from '../../utils';

const DEFAULT_DATA = [];

export const useLocations = (options = {}) => {
  const { tenantId, ...restOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'locations' });

  const { isLoading, data } = useQuery(
    [namespace, tenantId],
    async () => {
      const locationsResult = await fetchAllRecords(
        {
          GET: async ({ params }) => {
            const path = typeof params === 'object'
              ? `${LOCATIONS_API}?${queryString.stringify(params)}`
              : LOCATIONS_API;

            const { locations } = await ky.get(path).json();

            return locations.map((location) => ({ tenantId, ...location }));
          },
        },
        'cql.allRecords=1 sortby name',
      );

      return { locations: locationsResult };
    },
    {
      ...restOptions,
    },
  );

  return ({
    locations: data?.locations || DEFAULT_DATA,
    isLoading,
  });
};
