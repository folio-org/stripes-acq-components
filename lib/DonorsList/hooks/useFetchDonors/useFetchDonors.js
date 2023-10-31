import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { VENDORS_API } from '../../../constants';
import { batchRequest } from '../../../utils';

const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(chunkId => `id==${chunkId}`)
    .join(' or ');

  return query || '';
};

export const useFetchDonors = () => {
  const ky = useOkapiKy();

  const { isLoading, mutateAsync } = useMutation(
    ({ donorOrganizationIds }) => {
      return batchRequest(
        ({ params: searchParams }) => ky
          .get(VENDORS_API, { searchParams })
          .json()
          .then(({ organizations }) => organizations),
        donorOrganizationIds,
        buildQueryByIds,
      );
    },
  );

  return ({
    fetchDonorsMutation: mutateAsync,
    isLoading,
  });
};
