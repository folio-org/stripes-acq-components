import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { VENDORS_API } from '../../../constants';
import { batchRequest } from '../../../utils';
import { DEFAULT_DATA } from './constants';

export const useFetchDonors = (donorOrganizationIds = DEFAULT_DATA, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const namespace = useNamespace({ key: 'fetch-donors-list' });

  const { isLoading, data } = useQuery(
    [namespace, donorOrganizationIds],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky
          .get(VENDORS_API, { searchParams })
          .json()
          .then(({ organizations }) => organizations),
        donorOrganizationIds,
      );
    },
    {
      enabled: enabled && Boolean(donorOrganizationIds.length),
      ...queryOptions,
    },
  );

  return ({
    donors: data || DEFAULT_DATA,
    isLoading,
  });
};
