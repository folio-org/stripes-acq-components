import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  INSTITUTIONS_API,
  LIMIT_MAX_EXTENDED,
} from '../../constants';

const DEFAULT_DATA = [];

export const useInstitutions = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'location-units-institutions' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    query: 'cql.allRecords=1 sortby name',
  };

  const { isLoading, data = {} } = useQuery(
    [namespace],
    () => ky.get(INSTITUTIONS_API, { searchParams }).json(),
  );

  return {
    institutions: data.locinsts || DEFAULT_DATA,
    isLoading,
  };
};
