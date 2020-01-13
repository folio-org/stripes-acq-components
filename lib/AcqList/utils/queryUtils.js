import { omit } from 'lodash';

import {
  SEARCH_PARAMETER,
  ASC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
} from '../constants';

export const buildFilterQuery = (queryParams, getSearchQuery) => {
  const filterParams = omit(queryParams, [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER]);

  return Object.keys(filterParams).map((filterKey) => {
    const filterValue = queryParams[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      return getSearchQuery(filterValue, queryParams[SEARCH_INDEX_PARAMETER]);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}=(${filterValue.join(' or ')})`;
    }

    return `${filterKey}=${filterValue}`;
  }).filter(q => q).join(' and ');
};

export const buildSortingQuery = (queryParams) => {
  if (queryParams.sorting) {
    return `sortby ${queryParams.sorting}/sort.${queryParams.sortingDirection || ASC_DIRECTION}`;
  }

  return '';
};

export const connectQuery = (filterQuery, sortingQuery) => {
  if (sortingQuery) {
    return `(${filterQuery}) ${sortingQuery}`;
  }

  return filterQuery;
};

export const makeQueryBuilder = (searchAllQuery, getSearchQuery) => {
  return (queryParams) => {
    const filterQuery = buildFilterQuery(queryParams, getSearchQuery) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams);

    return connectQuery(filterQuery, sortingQuery);
  };
};
