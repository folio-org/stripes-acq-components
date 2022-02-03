import { omit } from 'lodash';
import moment from 'moment';

import { emptyArrayFilterValue } from '../../constants';
import {
  SEARCH_PARAMETER,
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
  ASC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
  DATE_RANGE_FILTER_FORMAT,
} from '../constants';

export const buildArrayFieldQuery = (filterKey, filterValue) => {
  if (Array.isArray(filterValue)) {
    return `${filterKey}==(${filterValue.map(v => `*"${v}"*`).join(' or ')})`;
  }

  if (filterValue === emptyArrayFilterValue) {
    return `${filterKey}==${filterValue}`;
  }

  return `${filterKey}==${`*"${filterValue}"*`}`;
};

export const buildDateRangeQuery = (filterKey, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = moment(from).startOf('day').format(DATE_RANGE_FILTER_FORMAT);
  const end = moment(to).endOf('day').format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const buildDateTimeRangeQuery = (filterKey, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = moment(from).startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
  const end = moment(to).endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER, OFFSET_PARAMETER, LIMIT_PARAMETER],
);

export const getFiltersCount = (filters) => {
  return filters && Object.keys(getFilterParams(filters)).filter(k => filters[k] !== undefined).length;
};

export const buildFilterQuery = (queryParams, getSearchQuery, customFilterMap = {}) => {
  const filterParams = getFilterParams(queryParams);

  return Object.keys(filterParams).map((filterKey) => {
    const filterValue = queryParams[filterKey];
    const buildCustomFilterQuery = customFilterMap[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      return `(${getSearchQuery(filterValue, queryParams[SEARCH_INDEX_PARAMETER])})`;
    }

    if (buildCustomFilterQuery) {
      return buildCustomFilterQuery(filterValue);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}==(${filterValue.map(v => `"${v}"`).join(' or ')})`;
    }

    return `${filterKey}=="${filterValue}"`;
  }).filter(q => q).join(' and ');
};

export const buildSortingQuery = (queryParams, customSortMap = {}) => {
  if (queryParams.sorting) {
    const key = customSortMap[queryParams.sorting] || queryParams.sorting;

    return `sortby ${key}/sort.${queryParams.sortingDirection || ASC_DIRECTION}`;
  }

  return '';
};

export const connectQuery = (filterQuery, sortingQuery) => {
  if (sortingQuery) {
    return `(${filterQuery}) ${sortingQuery}`;
  }

  return filterQuery;
};

export const makeQueryBuilder = (searchAllQuery, getSearchQuery, defaultSorting, customFilterMap, customSortMap) => {
  return (queryParams) => {
    const filterQuery = buildFilterQuery(queryParams, getSearchQuery, customFilterMap) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams, customSortMap) || defaultSorting;

    return connectQuery(filterQuery, sortingQuery);
  };
};
