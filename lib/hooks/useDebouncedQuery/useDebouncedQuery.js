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

export const useDebouncedQuery = ({
  api,
  queryBuilder,
  dataFormatter,
  debounceDelay = DEBOUNCE_DELAY,
  limit = LIST_ITEMS_LIMIT,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'locations' });

  const debouncedSetInputValue = useMemo(() => {
    return debounce((value) => setInputValue(value), debounceDelay);
  }, [debounceDelay]);

  const { isLoading } = useQuery({
    queryKey: [namespace, inputValue],
    queryFn: async ({ signal }) => {
      if (!inputValue) return [];

      const searchParams = {
        query: queryBuilder(inputValue),
        limit,
      };

      const res = await ky.get(api, { searchParams, signal }).json();

      return dataFormatter(res);
    },
    enabled: Boolean(inputValue),
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
    inputValue,
    setInputValue: debouncedSetInputValue,
  };
};
