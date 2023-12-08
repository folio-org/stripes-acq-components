import queryString from 'query-string';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LOCATIONS_API } from '../../constants';
import { fetchAllRecords } from '../../utils';

const DEFAULT_DATA = [];

export const useLocations = (options) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'locations' });

  const { isLoading, data } = useQuery(
    [namespace],
    () => {
      return fetchAllRecords(
        {
          GET: async ({ params }) => {
            const path = typeof params === 'object'
              ? `${LOCATIONS_API}?${queryString.stringify(params)}`
              : LOCATIONS_API;

            const { locations } = await ky.get(path).json();
  
            return locations;
          },
        },
        'cql.allRecords=1 sortby name',
      )
    },
    options,
  );

  return ({
    locations: data || DEFAULT_DATA,
    isLoading,
  });
}
