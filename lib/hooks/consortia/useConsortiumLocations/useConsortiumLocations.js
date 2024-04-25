import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import { LOCATIONS_API } from '../../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';

const DEFAULT_DATA = [];

export const useConsortiumLocations = (options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'locations' });
  const { initPublicationRequest } = usePublishCoordinator();

  const { tenants, ...restOptions } = options;
  const targetTenants = tenants || stripes?.user?.user?.tenants;

  const { isLoading, data } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      if (!targetTenants?.length) return [];

      const publication = {
        url: `${LOCATIONS_API}`,
        method: 'GET',
        tenants: targetTenants.map(({ id }) => id),
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

      return {
        flattenRecords,
        publicationErrors,
      };
    },
    ...restOptions,
  });

  return ({
    locations: data?.flattenRecords || DEFAULT_DATA,
    errors: data?.publicationErrors,
    isLoading,
  });
};
