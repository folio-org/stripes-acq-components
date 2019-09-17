import queryString from 'query-string';

export const buildSearch = (newQueryParams, searchString) => {
  const queryParams = Object.keys(newQueryParams).reduce((acc, paramKey) => {
    const paramValue = newQueryParams[paramKey];

    if (!paramValue) return acc;

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

    if (!Array.isArray(queryValue) && queryKey !== 'query') {
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
    sortingField: queryParams.sorting,
    sortingDirection: queryParams.sortingDirection || 'ascending',
  };
};
