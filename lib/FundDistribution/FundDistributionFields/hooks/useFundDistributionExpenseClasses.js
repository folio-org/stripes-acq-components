import sortBy from 'lodash/sortBy';
import { useMemo } from 'react';
import { useQueries } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { fetchFundExpenseClasses } from '../../../utils';

// Expense classes for a given fund+fiscalYear combination change rarely; 5 minutes is sufficient.
const STALE_TIME = 5 * 60 * 1000;

// Prefetches expense classes for every fund currently in the distribution using react-query.
// Concurrent requests for the same (fundId, fiscalYearId) are deduplicated automatically,
// and results are cached so re-selecting a fund never triggers a second request within STALE_TIME.
export const useFundDistributionExpenseClasses = ({ fiscalYearId, fundDistribution }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fund-expense-classes' });

  // Deduplicate fund IDs so we issue one request per unique fund, not one per row.
  const uniqueFundIds = useMemo(
    () => [...new Set(fundDistribution?.map(({ fundId }) => fundId).filter(Boolean) || [])],
    [fundDistribution],
  );

  const queries = useQueries(
    uniqueFundIds.map(fundId => ({
      queryKey: [namespace, fundId, fiscalYearId],
      queryFn: ({ signal }) => {
        const searchParams = { status: 'Active' };

        if (fiscalYearId) searchParams.fiscalYearId = fiscalYearId;

        return fetchFundExpenseClasses(ky.extend({ signal }))(fundId, { searchParams });
      },
      staleTime: STALE_TIME,
    })),
  );

  // Build the map on every render — react-query v3 returns a new array reference from
  // useQueries each time, making stable memoization impractical without extra bookkeeping.
  // The reduce over a handful of fund IDs is negligible cost.
  const expenseClassesByFundId = uniqueFundIds.reduce((acc, fundId, i) => {
    const data = queries[i]?.data;

    if (data) acc[fundId] = sortBy(data, ({ name }) => name.toLowerCase());

    return acc;
  }, {});

  return {
    expenseClassesByFundId,
    isFetching: queries.some(({ isFetching }) => isFetching),
    isLoading: queries.some(({ isLoading }) => isLoading),
  };
};
