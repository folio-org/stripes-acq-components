import { EXPENSE_CLASSES_API } from '../../constants';

export const fetchExpenseClasses = (httpClient) => async (options) => {
  return httpClient.get(EXPENSE_CLASSES_API, options).json();
};
