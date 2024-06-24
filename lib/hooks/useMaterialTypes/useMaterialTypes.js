import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX, MATERIAL_TYPE_API } from '../../constants';

export const DEFAULT_VALUE = [];

export const useMaterialTypes = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...restOptions
  } = options;
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'material-types' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(MATERIAL_TYPE_API, { searchParams, signal }).json(),
    enabled,
    ...restOptions,
  });

  return ({
    materialTypes: data.mtypes || DEFAULT_VALUE,
    isLoading,
  });
};
