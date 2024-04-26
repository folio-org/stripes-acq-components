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

      const {
        publicationErrors: errors,
        publicationResults,
      } = await initPublicationRequest(publication);

      const locations = publicationResults.flatMap(({ tenantId, response }) => (
        response?.locations?.map((item) => {
          const additive = {
            test_id: Date.now(),
            tenantId,
          };

          return { ...item, ...additive };
        })
      )).filter(Boolean);

      return {
        locations,
        errors,
      };
    },
    ...restOptions,
  });

  return ({
    locations: data?.locations || DEFAULT_DATA,
    errors: data?.errors,
    isLoading,
  });
};
