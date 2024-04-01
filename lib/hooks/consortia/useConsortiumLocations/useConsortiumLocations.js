import queryString from 'query-string';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import { LOCATIONS_API } from '../../../constants';
import { usePublishCoordinator } from '../../usePublishCoordinator';

const DEFAULT_DATA = [];

export const useConsortiumLocations = (options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'locations' });
  const { initPublicationRequest } = usePublishCoordinator();

  const tenants = stripes?.user?.user?.tenants;
  const searchParams = {
    query: 'cql.allRecords=1',
  };

  const { isLoading, data } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      if (!tenants?.length) return [];

      const publication = {
        url: `${LOCATIONS_API}`,
        method: 'GET',
        tenants: tenants.map(({ id }) => id),
      };

      const { publicationErrors, publicationResults } = await initPublicationRequest(publication);

      const flattenRecords = publicationResults.flatMap(({ tenantId, response }) => (
        response?.locations?.map((item) => {
          const additive = {
            test_id: Date.now(),
            tenantId,
          };

          return { ...item, ...additive };
        })
      )).filter(Boolean);

      return flattenRecords;
    },
    ...options,
  });

  return ({
    locations: data || DEFAULT_DATA,
    isLoading,
  });
};
