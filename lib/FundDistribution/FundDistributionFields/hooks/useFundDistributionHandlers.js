import {
  useCallback,
  useMemo,
} from 'react';
import { useQueryClient } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { FUND_DISTR_TYPE } from '../../../constants';
import { fetchFundExpenseClasses } from '../../../utils';

const STALE_TIME = 5 * 60 * 1000;

// Provides default action handlers for fund distribution fields.
// Uses the same react-query namespace and stale time as useFundDistributionExpenseClasses so
// queryClient.fetchQuery in onSelectFund hits the cache pre-warmed by that hook.
export const useFundDistributionHandlers = ({
  change,
  fiscalYearId,
  funds,
}) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const [namespace] = useNamespace({ key: 'fund-expense-classes' });
  const fundCodes = useMemo(() => funds && new Map(funds.map(f => [f.id, f.code])), [funds]);

  const onSelectFund = useCallback((fieldName, fundId) => {
    change(`${fieldName}.fundId`, fundId || null);
    change(`${fieldName}.code`, fundCodes.get(fundId) || null);
    change(`${fieldName}.encumbrance`, null);

    const searchParams = { status: 'Active' };

    if (fiscalYearId) searchParams.fiscalYearId = fiscalYearId;

    // fetchQuery returns cached data immediately if fresh (pre-warmed by useFundDistributionExpenseClasses),
    // otherwise fetches and caches so the expense classes hook doesn't need to re-fetch.
    queryClient.fetchQuery({
      queryKey: [namespace, fundId, fiscalYearId],
      queryFn: () => fetchFundExpenseClasses(ky)(fundId, { searchParams }),
      staleTime: STALE_TIME,
    })
      .then((classes) => {
        // Auto-select when the fund has exactly one active expense class.
        change(`${fieldName}.expenseClassId`, classes?.length === 1 ? classes[0].id : null);
      })
      .catch(() => {
        change(`${fieldName}.expenseClassId`, null);
      });
  }, [change, fiscalYearId, fundCodes, ky, namespace, queryClient]);

  const onChangeToAmount = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), null);
  }, [change]);

  const onChangeToPercent = useCallback(distributionTypeFieldName => {
    change(distributionTypeFieldName.replace('distributionType', 'value'), 100);
  }, [change]);

  const onAdd = useCallback((fields) => {
    fields.push({ distributionType: FUND_DISTR_TYPE.percent, value: 100 });
  }, []);

  const onRemove = useCallback((fields, index) => {
    fields.remove(index);
  }, []);

  return {
    onAdd,
    onChangeToAmount,
    onChangeToPercent,
    onRemove,
    onSelectFund,
  };
};
