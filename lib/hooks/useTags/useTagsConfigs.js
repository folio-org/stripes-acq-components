import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CONFIG_API,
  LIMIT_MAX,
} from '../../constants';

const DEFAULT_DATA = [];

export const useTagsConfigs = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'tags-configs' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: '(module=TAGS and configName=tags_enabled)',
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetched,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(CONFIG_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    configs: data?.configs || DEFAULT_DATA,
    isFetched,
    isFetching,
    isLoading,
    refetch,
  });
};
