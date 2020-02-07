import { omit } from 'lodash';

import {
  SEARCH_PARAMETER,
  ASC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
} from '../constants';

export const buildFilterQuery = (queryParams, getSearchQuery, customFilterMap = {}) => {
  const filterParams = omit(queryParams, [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER]);

  return Object.keys(filterParams).map((filterKey) => {
    const filterValue = queryParams[filterKey];
    const buildCustomFilterQuery = customFilterMap[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      return getSearchQuery(filterValue, queryParams[SEARCH_INDEX_PARAMETER]);
    }

    if (buildCustomFilterQuery) {
      return buildCustomFilterQuery(filterValue);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}=(${filterValue.map(v => `"${v}"`).join(' or ')})`;
    }

    return `${filterKey}="${filterValue}"`;
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

export const makeQueryBuilder = (searchAllQuery, getSearchQuery, defaultSorting, customFilterMap) => {
  return (queryParams) => {
    const filterQuery = buildFilterQuery(queryParams, getSearchQuery, customFilterMap) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams) || defaultSorting;

    return connectQuery(filterQuery, sortingQuery);
  };
};
