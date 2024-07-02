import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY,
  ORDERS_STORAGE_SETTINGS_API,
} from '../../constants';

export const useDefaultReceivingSearchSettings = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('default-receiving-search-settings');

  const searchParams = {
    limit: 1,
    query: `key=${CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY}`,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      const response = await ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams }).json();

      return response?.settings?.[0];
    },
    ...options,
  });

  return ({
    data,
    isFetching,
    isLoading,
    refetch,
  });
};
