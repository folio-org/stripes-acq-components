import { INVOICES_API } from '../../constants';

export const fetchInvoices = (httpClient) => async (options) => {
  return httpClient.get(INVOICES_API, options).json();
};
