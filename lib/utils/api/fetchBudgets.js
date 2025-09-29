import { BUDGETS_API } from '../../constants';

export const fetchBudgets = (httpClient) => async (options) => {
  return httpClient.get(BUDGETS_API, options).json();
};
