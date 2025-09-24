import { batchRequest } from '../batchFetch';
import { fetchExpenseClasses } from './fetchExpenseClasses';

export const fetchExpenseClassByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchExpenseClasses(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          expenseClasses: acc.expenseClasses.concat(response.expenseClasses),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { expenseClasses: [], totalRecords: 0 });
    });
  };
};
