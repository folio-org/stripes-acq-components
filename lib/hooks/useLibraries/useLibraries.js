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

export const useLibraries = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'location-units-libraries' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(LIBRARIES_API, { searchParams }).json(),
  );

  return {
    libraries: data.loclibs || DEFAULT_DATA,
    isLoading,
  };
};
