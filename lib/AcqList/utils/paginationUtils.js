import queryString from 'query-string';

import {
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
} from '../constants';

export const buildPaginationObj = (searchString, defaultPagination = {}) => {
  const queryParams = queryString.parse(searchString);

  return {
    limit: Number(queryParams[LIMIT_PARAMETER] || defaultPagination.limit),
    offset: Number(queryParams[OFFSET_PARAMETER] || defaultPagination.offset),
  };
};
