import {
  LIMIT_PARAMETER,
  SEARCH_PARAMETER,
} from '../../AcqList/constants';
import {
  ACQUISITIONS_UNITS_API,
  BATCH_IDENTIFIER_TYPE,
  BUDGETS_API,
  CONSORTIUM_BATCH_HOLDINGS_API,
  CONSORTIUM_LOCATIONS_API,
  EXCHANGE_RATE_SOURCE_API,
  EXPENSE_CLASSES_API,
  FISCAL_YEARS_API,
  FUNDS_API,
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

import {
  fetchConsortiumBatchHoldings,
  fetchConsortiumHoldingsByIds,
  fetchConsortiumLocations,
} from './consortia';
import { fetchAcqUnitsByIds } from './fetchAcqUnitsByIds';
import { fetchBudgets } from './fetchBudgets';
import { fetchExchangeRateSource } from './fetchExchangeRateSource';
import { fetchExpenseClassByIds } from './fetchExpenseClassByIds';
import { fetchExpenseClasses } from './fetchExpenseClasses';
import { fetchFiscalYears } from './fetchFiscalYears';
import { fetchFundByIds } from './fetchFundByIds';
import { fetchFunds } from './fetchFunds';
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
import { fetchTransactionByIds } from './fetchTransactionByIds';

const httpClient = {
  extend: jest.fn().mockReturnThis(),
  get: jest.fn(() => ({
    json: jest.fn(() => Promise.resolve({})),
  })),
  post: jest.fn(() => ({
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

  describe('fetchBudgets', () => {
    it('should fetch budgets', async () => {
      await fetchBudgets(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(BUDGETS_API, options);
    });
  });

  describe('fetchExpenseClassByIds', () => {
    it('should fetch expense classes by ids', async () => {
      await fetchExpenseClassByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(EXPENSE_CLASSES_API, { searchParams });
    });
  });

  describe('fetchExpenseClasses', () => {
    it('should fetch expense classes', async () => {
      await fetchExpenseClasses(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(EXPENSE_CLASSES_API, options);
    });
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
    it('should fetch transaction by id', async () => {
      const transactionId = '12345';

      await fetchTransactionById(httpClient)(transactionId, options);

      expect(httpClient.get).toHaveBeenCalledWith(`${TRANSACTIONS_API}/${transactionId}`, options);
    });
  });

  describe('fetchTransactionByIds', () => {
    it('should fetch transactions by ids', async () => {
      await fetchTransactionByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(TRANSACTIONS_API, { searchParams });
    });
  });

  describe('fetchFunds', () => {
    it('should fetch funds', async () => {
      await fetchFunds(httpClient)(options);

      expect(httpClient.get).toHaveBeenCalledWith(FUNDS_API, options);
    });
  });

  describe('fetchFundByIds', () => {
    it('should fetch funds by ids', async () => {
      await fetchFundByIds(httpClient)(ids, options);

      expect(httpClient.get).toHaveBeenCalledWith(FUNDS_API, { searchParams });
    });
  });

  describe('Consortia', () => {
    const stripes = {
      user: {
        user: {
          consortium: {
            centralTenantId: 'tenantId',
          },
        },
      },
    };

    describe('fetchConsortiumBatchHoldings', () => {
      it('should fetch consortium batch holdings', async () => {
        const dto = {
          identifierType: BATCH_IDENTIFIER_TYPE.id,
          identifierValues: ids,
        };

        await fetchConsortiumBatchHoldings(httpClient, stripes)(dto, options);

        expect(httpClient.post).toHaveBeenCalledWith(CONSORTIUM_BATCH_HOLDINGS_API, { json: dto });
      });
    });

    describe('fetchConsortiumHoldingsByIds', () => {
      it('should return default values when no IDs are provided', async () => {
        const result = await fetchConsortiumHoldingsByIds(httpClient, stripes)([], options);

        expect(httpClient.post).not.toHaveBeenCalled();
        expect(result).toEqual({
          holdings: [],
          totalRecords: 0,
        });
      });

      it('should fetch consortium holdings by ids', async () => {
        await fetchConsortiumHoldingsByIds(httpClient, stripes)(ids, options);

        expect(httpClient.post).toHaveBeenCalledWith(CONSORTIUM_BATCH_HOLDINGS_API, {
          json: {
            identifierType: BATCH_IDENTIFIER_TYPE.id,
            identifierValues: ids,
          },
        });
      });
    });

    describe('fetchConsortiumLocations', () => {
      it('should fetch consortium locations', async () => {
        await fetchConsortiumLocations(httpClient, stripes)(options);

        expect(httpClient.get).toHaveBeenCalledWith(CONSORTIUM_LOCATIONS_API, options);
      });
    });
  });
});
