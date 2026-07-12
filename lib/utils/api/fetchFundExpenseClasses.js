import { FUNDS_API } from '../../constants';

// Returns expense classes assigned to a specific fund's budget.
// Unlike finance/expense-classes, this endpoint scopes results to the fund and supports fiscalYearId filtering.
export const fetchFundExpenseClasses = (httpClient) => (fundId, options) => {
  return httpClient.get(`${FUNDS_API}/${fundId}/expense-classes`, options).json();
};
