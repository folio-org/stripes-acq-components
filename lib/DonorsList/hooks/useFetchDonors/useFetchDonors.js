import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { VENDORS_API } from '../../../constants';
import { batchRequest } from '../../../utils';

const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(chunkId => `id==${chunkId}`)
    .join(' or ');

  return query || '';
};

export const useFetchDonors = (donorOrganizationIds = []) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'fetch-donors-list' });

  const { isLoading, data, refetch } = useQuery(
    [namespace, donorOrganizationIds],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky
          .get(VENDORS_API, { searchParams })
          .json()
          .then(({ organizations }) => organizations),
        donorOrganizationIds,
        buildQueryByIds,
      );
    },
    { enabled: Boolean(donorOrganizationIds.length) },
  );

  return ({
    donors: data || [],
    isLoading,
    refetch,
  });
};
