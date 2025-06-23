import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { fetchFiscalYearById } from '../../utils';

export const useFiscalYear = (fiscalYearId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'fiscal-year' });

  const {
    data,
    ...rest
  } = useQuery({
    queryKey: [namespace, fiscalYearId],
    queryFn: ({ signal }) => fetchFiscalYearById(ky)(fiscalYearId, { signal }),
    enabled: enabled && Boolean(fiscalYearId),
    ...queryOptions,
  });

  return ({
    fiscalYear: data,
    ...rest,
  });
};
