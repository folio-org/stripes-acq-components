import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CATEGORIES_API,
  LIMIT_MAX,
} from '../../constants';
import { useTranslatedCategories } from '../useTranslatedCategories';

const DEFAULT_DATA = [];

export const useCategories = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('categories');

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1',
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace],
    () => ky.get(CATEGORIES_API, { searchParams }).json(),
    options,
  );

  const [translatedCategories] = useTranslatedCategories(data?.categories);

  return ({
    categories: translatedCategories || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
