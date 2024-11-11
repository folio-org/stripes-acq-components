import { batchRequest } from '../batchFetch';
import { fetchReceivingTitles } from './fetchReceivingTitles';

export const fetchReceivingTitlesByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchReceivingTitles(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          titles: acc.titles.concat(response.titles),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { titles: [], totalRecords: 0 });
    });
  };
};
