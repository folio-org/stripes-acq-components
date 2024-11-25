import debounce from 'lodash/debounce';
import {
  useMemo,
  useState,
} from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

const LIST_ITEMS_LIMIT = 100;
const DEBOUNCE_DELAY = 500;
const DEFAULT_DATA_FORMATTER = (data) => data;

export const useDebouncedQuery = ({
  api,
  queryBuilder,
  dataFormatter = DEFAULT_DATA_FORMATTER,
  debounceDelay = DEBOUNCE_DELAY,
  limit = LIST_ITEMS_LIMIT,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [namespace] = useNamespace({ key: api });
  const ky = useOkapiKy();

  const debounceSetSearchQuery = useMemo(() => {
    return debounce((value) => setSearchQuery(value), debounceDelay);
  }, [debounceDelay]);

  const { isLoading } = useQuery({
    queryKey: [namespace, searchQuery],
    queryFn: async ({ signal }) => {
      if (!searchQuery) return [];

      const searchParams = {
        query: queryBuilder(searchQuery),
        limit,
      };

      const res = await ky.get(api, { searchParams, signal }).json();

      return dataFormatter(res);
    },
    enabled: Boolean(searchQuery),
    onSuccess: (data) => {
      setOptions(data);
    },
    onError: () => {
      setOptions([]);
    },
  });

  return {
    options,
    isLoading,
    searchQuery,
    setSearchQuery: debounceSetSearchQuery,
  };
};
