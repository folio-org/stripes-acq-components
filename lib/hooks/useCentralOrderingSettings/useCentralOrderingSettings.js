import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CENTRAL_ORDERING_SETTINGS_KEY,
  ORDERS_STORAGE_SETTINGS_API,
} from '../../constants';

const DEFAULT_DATA = {};

export const useCentralOrderingSettings = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('central-ordering-settings');

  const searchParams = {
    limit: 1,
    query: `key=${CENTRAL_ORDERING_SETTINGS_KEY}`,
  };

  const {
    data = DEFAULT_DATA,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace],
    queryFn: async () => {
      const response = ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams }).json();

      return response?.settings?.[0];
    },
    ...options,
  });

  return ({
    data,
    enabled: data.value === 'true',
    isFetching,
    isLoading,
  });
};
