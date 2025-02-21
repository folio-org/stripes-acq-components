import { FISCAL_YEARS_API } from '../../constants';

export const fetchFiscalYears = (httpClient) => async (options) => {
  return httpClient.get(FISCAL_YEARS_API, options).json();
};
