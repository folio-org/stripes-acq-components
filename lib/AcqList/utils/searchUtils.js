import queryString from 'query-string';

import {
  SEARCH_PARAMETER,
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

export const buildFiltersObj = (searchString) => {
  const queryParams = queryString.parse(searchString);

  return Object.keys(queryParams).reduce((acc, queryKey) => {
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

export const buildSortingObj = (searchString) => {
  const queryParams = queryString.parse(searchString);

  return {
    sortingField: queryParams[SORTING_PARAMETER],
    sortingDirection: queryParams[SORTING_DIRECTION_PARAMETER] || ASC_DIRECTION,
  };
};
