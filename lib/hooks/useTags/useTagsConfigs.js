import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { SETTINGS_SCOPES } from '../../constants';
import { fetchTagsConfigs } from '../../utils/api';

const DEFAULT_DATA = [];

export const useTagsConfigs = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'tags-configs' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data,
    isFetched,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [SETTINGS_SCOPES.TAGS, namespace, tenantId],
    queryFn: ({ signal }) => fetchTagsConfigs(ky)({ signal }),
    enabled,
    ...queryOptions,
  });

  return ({
    configs: data?.items || DEFAULT_DATA,
    isFetched,
    isFetching,
    isLoading,
    refetch,
  });
};
