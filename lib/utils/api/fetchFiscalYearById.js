import { FISCAL_YEARS_API } from '../../constants';

export const fetchFiscalYearById = (httpClient) => async (fiscalYearId, options) => {
  return httpClient.get(`${FISCAL_YEARS_API}/${fiscalYearId}`, options).json();
};
