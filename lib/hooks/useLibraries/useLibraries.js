import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  LIBRARIES_API,
  LIMIT_MAX_EXTENDED,
} from '../../constants';

const DEFAULT_DATA = [];

export const useLibraries = (options = {}) => {
  const { tenantId, ...restOptions } = options;
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'location-units-libraries' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace, tenantId],
    () => ky.get(LIBRARIES_API, { searchParams }).json(),
    {
      ...restOptions,
    },
  );

  return {
    libraries: data.loclibs || DEFAULT_DATA,
    isLoading,
  };
};
