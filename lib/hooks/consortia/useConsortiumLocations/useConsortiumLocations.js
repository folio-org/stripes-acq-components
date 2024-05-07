import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { LOCATIONS_API } from '../../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useCurrentUserTenants } from '../useCurrentUserTenants';

const DEFAULT_DATA = [];

export const useConsortiumLocations = (options = {}) => {
  const [namespace] = useNamespace({ key: 'locations' });
  const currentUserTenants = useCurrentUserTenants();
  const { initPublicationRequest } = usePublishCoordinator();

  const { tenants, ...restOptions } = options;
  const targetTenants = tenants || currentUserTenants;

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
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
    isFetching,
    isLoading,
  });
};
