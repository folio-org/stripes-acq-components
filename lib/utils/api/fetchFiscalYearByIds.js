import { batchRequest } from '../batchFetch';
import { fetchFiscalYears } from './fetchFiscalYears';

export const fetchFiscalYearByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchFiscalYears(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          fiscalYears: acc.fiscalYears.concat(response.fiscalYears),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { fiscalYears: [], totalRecords: 0 });
    });
  };
};
