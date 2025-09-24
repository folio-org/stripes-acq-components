import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  batchRequest,
  fetchBudgets,
  fetchExpenseClassByIds,
  fetchFundByIds,
  fetchTransactionByIds,
} from '../../utils';

export const useFundDistribution = (fundDistributions, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'aggregated-fund-distribution' });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId, fundDistributions],
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
          const query = itemsChunk
            .map(({ fromFundId, fiscalYearId }) => `(fundId==${fromFundId} and fiscalYearId==${fiscalYearId})`)
            .join(' or ');

          return query || '';
        },
      );

      const fundsMap = new Map(funds.map(fund => [fund.id, fund]));
      const encumbrancesMap = new Map(encumbrances.map(encumbrance => [encumbrance.id, encumbrance]));
      const fundBudgetMap = new Map(budgets.map(budget => [budget.fundId, budget]));
      const expenseClassesMap = new Map(expenseClasses.map(ec => [ec.id, ec]));

      const result = fundDistributions.map(distr => {
        const { name = '', code = '' } = fundsMap.get(distr.fundId) || {};
        const fundName = `${name}${code ? `(${code})` : ''}`;
        const fundEncumbrance = encumbrancesMap.get(distr.encumbrance);
        const fundBudget = fundBudgetMap.get(distr.fundId);
        const fundExpenseClass = expenseClassesMap.get(distr.expenseClassId);

        return {
          ...distr,
          fundBudget,
          fundEncumbrance,
          fundExpenseClass,
          fundName,
        };
      });

      return result;
    },
    enabled,
    ...queryOptions,
  });

  return {
    data,
    ...rest,
  };
};
