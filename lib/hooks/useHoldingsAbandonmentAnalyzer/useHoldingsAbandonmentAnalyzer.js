import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { fetchHoldingsRelatedEntities } from '../../utils/api';
import { HoldingsAbandonmentAnalyzer } from '../../utils';

export const useHoldingsAbandonmentAnalyzer = () => {
  const ky = useOkapiKy();

  const {
    isLoading,
    mutateAsync,
  } = useMutation({
    mutationFn: async ({ holdingIds, signal }) => {
      const holdingRelatedEntities = await fetchHoldingsRelatedEntities(ky)(holdingIds, { signal });
      const analyzer = new HoldingsAbandonmentAnalyzer(holdingRelatedEntities);

      return analyzer;
    },
  });

  return {
    analyzerFactory: mutateAsync,
    isLoading,
  };
};
