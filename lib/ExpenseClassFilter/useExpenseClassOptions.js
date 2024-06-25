import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  EXPENSE_CLASSES_API,
  LIMIT_MAX,
} from '../constants';

const DEFAULT_DATA = [];

export const useExpenseClassOptions = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'expense-class-options' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { data } = useQuery({
    queryKey: [EXPENSE_CLASSES_API, namespace, tenantId],
    queryFn: () => ky.get(`${EXPENSE_CLASSES_API}`, { searchParams }).json(),
    enabled,
    ...queryOptions,
  });

  return data?.expenseClasses?.map(({ id, name }) => ({ value: id, label: name })) || DEFAULT_DATA;
};
