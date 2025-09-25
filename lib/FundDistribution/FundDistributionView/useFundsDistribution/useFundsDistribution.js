import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  batchRequest,
  CQLBuilder,
  fetchBudgets,
  fetchExpenseClassByIds,
  fetchFundByIds,
  fetchTransactionByIds,
} from '../../../utils';

export const useFundsDistribution = (fundDistributions, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'aggregated-fund-distribution' });

  /* Create stable query key to prevent unnecessary refetches */
  const fundDistributionQueryKey = useMemo(() => {
    return fundDistributions.map(({ fundId, encumbrance, expenseClassId }) => {
      return { fundId, encumbrance, expenseClassId };
    });
  }, [fundDistributions]);

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId, fundDistributionQueryKey],
    queryFn: async ({ signal }) => {
      const httpClient = ky.extend({ signal });

      const fundsPromise = fetchFundByIds(httpClient)(
        Array.from(new Set(
          fundDistributions
            .map(({ fundId }) => fundId)
            .filter(Boolean),
        )),
      ).then(({ funds }) => funds);

      const encumbrancesPromise = fetchTransactionByIds(httpClient)(
        Array.from(new Set(
          fundDistributions
            .map(({ encumbrance }) => encumbrance)
            .filter(Boolean),
        )),
      ).then(({ transactions }) => transactions);

      const expenseClassesPromise = fetchExpenseClassByIds(httpClient)(
        Array.from(new Set(
          fundDistributions
            .map(({ expenseClassId }) => expenseClassId)
            .filter(Boolean),
        )),
      ).then(({ expenseClasses }) => expenseClasses);

      const [
        funds,
        encumbrances,
        expenseClasses,
      ] = await Promise.all([fundsPromise, encumbrancesPromise, expenseClassesPromise]);

      const budgets = await batchRequest(
        ({ params: searchParams }) => fetchBudgets(httpClient)({ searchParams }).then((resp) => resp.budgets),
        encumbrances,
        (itemsChunk) => {
          return itemsChunk.reduce((cql, item) => {
            return cql.or().group((builder) => (
              builder
                .equal('fundId', item.fromFundId)
                .equal('fiscalYearId', item.fiscalYearId)
            ));
          }, new CQLBuilder()).build();
        },
      );

      return {
        funds,
        encumbrances,
        expenseClasses,
        budgets,
      };
    },
    enabled,
    ...queryOptions,
  });

  const fundsDistribution = useMemo(() => {
    const fundsMap = new Map(data?.funds?.map(fund => [fund.id, fund]));
    const encumbrancesMap = new Map(data?.encumbrances?.map(encumbrance => [encumbrance.id, encumbrance]));
    const fundBudgetMap = new Map(data?.budgets?.map(budget => [budget.fundId, budget]));
    const expenseClassesMap = new Map(data?.expenseClasses?.map(ec => [ec.id, ec]));

    return fundDistributions.map((fd) => {
      const { name = '', code = '' } = fundsMap.get(fd.fundId) || {};
      const fundName = `${name}${code ? `(${code})` : ''}`;
      const fundEncumbrance = encumbrancesMap.get(fd.encumbrance);
      const fundBudget = fundBudgetMap.get(fd.fundId);
      const fundExpenseClass = expenseClassesMap.get(fd.expenseClassId);

      return {
        ...fd,
        fundBudget,
        fundEncumbrance,
        fundExpenseClass,
        fundName,
      };
    });
  }, [data, fundDistributions]);

  return {
    fundsDistribution,
    ...rest,
  };
};
