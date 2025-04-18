import {
  LIMIT_PARAMETER,
  SEARCH_PARAMETER,
} from '../../AcqList/constants';
import {
  ACQUISITIONS_UNITS_API,
  EXCHANGE_RATE_SOURCE_API,
  FISCAL_YEARS_API,
  INVOICE_LINE_API,
  INVOICES_API,
  LIMIT_MAX,
  LINES_API,
  ORDER_PIECES_API,
  ORDERS_API,
  RECEIVING_TITLES_API,
  TRANSACTIONS_API,
  VENDORS_API,
} from '../../constants';

import { fetchAcqUnitsByIds } from './fetchAcqUnitsByIds';
import { fetchExchangeRateSource } from './fetchExchangeRateSource';
import { fetchFiscalYears } from './fetchFiscalYears';
import { fetchInvoiceLines } from './fetchInvoiceLines';
import { fetchInvoices } from './fetchInvoices';
import { fetchOrderLines } from './fetchOrderLines';
import { fetchOrderLinesByIds } from './fetchOrderLinesByIds';
import { fetchOrders } from './fetchOrders';
import { fetchOrdersByIds } from './fetchOrdersByIds';
import { fetchOrganizations } from './fetchOrganizations';
import { fetchOrganizationsByIds } from './fetchOrganizationsByIds';
import { fetchPieces } from './fetchPieces';
import { fetchReceivingTitles } from './fetchReceivingTitles';
import { fetchReceivingTitlesByIds } from './fetchReceivingTitlesByIds';
import { fetchTransactionById } from './fetchTransactionById';

const httpClient = {
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
};

const ids = ['1', '2'];
const options = {};
const searchParams = {
  [LIMIT_PARAMETER]: LIMIT_MAX,
  [SEARCH_PARAMETER]: 'id==1 or id==2',
};

describe('API utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchOrderLines', () => {
    it('should fetch order lines', async () => {
      await fetchOrderLines(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(LINES_API, options);
    });
  });

  describe('fetchOrderLinesByIds', () => {
    it('should fetch order lines by ids', async () => {
      await fetchOrderLinesByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(LINES_API, { searchParams });
    });
  });

  describe('fetchOrders', () => {
    it('should fetch orders', async () => {
      await fetchOrders(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(ORDERS_API, options);
    });
  });

  describe('fetchOrdersByIds', () => {
    it('should fetch orders by ids', async () => {
      await fetchOrdersByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(ORDERS_API, { searchParams });
    });
  });

  describe('fetchOrganizations', () => {
    it('should fetch organizations', async () => {
      await fetchOrganizations(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(VENDORS_API, options);
    });
  });

  describe('fetchOrganizationsByIds', () => {
    it('should fetch organizations by ids', async () => {
      await fetchOrganizationsByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(VENDORS_API, { searchParams });
    });
  });

  describe('fetchPieces', () => {
    it('should fetch pieces', async () => {
      await fetchPieces(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(ORDER_PIECES_API, options);
    });
  });

  describe('fetchReceivingTitles', () => {
    it('should fetch receiving titles', async () => {
      await fetchReceivingTitles(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(RECEIVING_TITLES_API, options);
    });
  });

  describe('fetchReceivingTitlesByIds', () => {
    it('should fetch receiving titles by ids', async () => {
      await fetchReceivingTitlesByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(RECEIVING_TITLES_API, { searchParams });
    });
  });

  describe('fetchAcqUnitsByIds', () => {
    it('should fetch acquisitions units by ids', async () => {
      await fetchAcqUnitsByIds(httpClient)(ids);

      expect(httpClient.get).toHaveBeenCalledWith(ACQUISITIONS_UNITS_API, { searchParams });
    });
  });

  describe('fetchFiscalYears', () => {
    it('should fetch fiscal years', async () => {
      await fetchFiscalYears(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(FISCAL_YEARS_API, options);
    });
  });

  describe('fetchExchangeRateSource', () => {
    it('should fetch exchange rate source', async () => {
      await fetchExchangeRateSource(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(EXCHANGE_RATE_SOURCE_API, options);
    });
  });

  describe('fetchInvoiceLines', () => {
    it('should fetch invoice lines', async () => {
      await fetchInvoiceLines(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(INVOICE_LINE_API, options);
    });
  });

  describe('fetchInvoices', () => {
    it('should fetch invoices', async () => {
      await fetchInvoices(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(INVOICES_API, options);
    });
  });

  describe('fetchTransactionById', () => {
    it('should transaction by id', async () => {
      const transactionId = '12345';

      await fetchTransactionById(httpClient)(transactionId, options);

      expect(httpClient.get).toHaveBeenCalledWith(`${TRANSACTIONS_API}/${transactionId}`, options);
    });
  });
});
