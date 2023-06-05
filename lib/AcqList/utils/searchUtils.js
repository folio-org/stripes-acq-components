import queryString from 'query-string';
import { pick } from 'lodash';

import {
  SEARCH_PARAMETER,
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
  ASC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
} from '../constants';

export const buildSearch = (newQueryParams, searchString) => {
  const queryParams = Object.keys(newQueryParams).reduce((acc, paramKey) => {
    const paramValue = newQueryParams[paramKey] || undefined;

    acc[paramKey] = paramValue;

    return acc;
  }, queryString.parse(searchString));

  return queryString.stringify(queryParams);
};

export const buildPaginatelessSearch = (searchString) => {
  return buildSearch({ [OFFSET_PARAMETER]: 0, [LIMIT_PARAMETER]: 0 }, searchString);
};

export const buildPaginatingSearch = (searchString) => {
  return queryString.stringify(pick(queryString.parse(searchString), [OFFSET_PARAMETER, LIMIT_PARAMETER]));
};

export const buildFiltersObj = (searchString) => {
  const queryParams = queryString.parse(searchString);

  return Object.keys(queryParams)
    .filter(key => ![OFFSET_PARAMETER, LIMIT_PARAMETER].includes(key))
    .reduce((acc, queryKey) => {
      const queryValue = queryParams[queryKey];
      const newAcc = { ...acc };

      if (!Array.isArray(queryValue) && ![SEARCH_PARAMETER, SEARCH_INDEX_PARAMETER].includes(queryKey)) {
        newAcc[queryKey] = [queryValue];
      } else {
        newAcc[queryKey] = queryValue;
      }

      return newAcc;
    }, {});
};

export const buildSortingObj = (searchString, defaultSorting = {}) => {
  const queryParams = queryString.parse(searchString);

  return {
    sortingField: queryParams[SORTING_PARAMETER] || defaultSorting[SORTING_PARAMETER],
    sortingDirection: queryParams[SORTING_DIRECTION_PARAMETER]
      || defaultSorting[SORTING_DIRECTION_PARAMETER]
      || ASC_DIRECTION,
  };
};
