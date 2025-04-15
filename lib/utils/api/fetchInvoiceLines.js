import { INVOICE_LINE_API } from '../../constants';

export const fetchInvoiceLines = (httpClient) => async (options) => {
  return httpClient.get(INVOICE_LINE_API, options).json();
};
