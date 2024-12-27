/* Developed collaboratively using AI (ChatGPT) */

import { getInvoiceExportData } from './getInvoiceExportData';
import { fetchAllRecords } from '../fetchAllRecords';
import { fetchExportDataByIds } from '../fetchExportDataByIds';
import { getAddresses } from '../getAddresses';
import { createInvoiceExportReport } from './createInvoiceExportReport';

jest.mock('../fetchAllRecords');
jest.mock('../fetchExportDataByIds');
jest.mock('../getAddresses');
jest.mock('./createInvoiceExportReport');

describe('getInvoiceExportData', () => {
  const mockKy = {
    get: jest.fn().mockImplementation(() => ({
      json: jest.fn().mockResolvedValue({ from: 'USD', to: 'EUR', rate: 0.85 }),
    })),
  };

  const mockIntl = {};
  const mockQuery = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and process invoice export data correctly', async () => {
    fetchAllRecords.mockResolvedValue([{ id: '1', vendorId: 'v1', currency: 'USD' }]);
    fetchExportDataByIds.mockResolvedValue([]);
    getAddresses.mockReturnValue([]);
    createInvoiceExportReport.mockReturnValue('Export Report');

    const result = await getInvoiceExportData({
      ky: mockKy,
      intl: mockIntl,
      query: mockQuery,
      currency: 'USD',
    });

    expect(fetchAllRecords).toHaveBeenCalled();
    expect(fetchExportDataByIds).toHaveBeenCalled();
    expect(createInvoiceExportReport).toHaveBeenCalledWith(
      expect.objectContaining({
        invoiceMap: { '1': { id: '1', vendorId: 'v1', currency: 'USD' } },
      }),
    );
    expect(result).toBe('Export Report');
  });

  it('should handle exchange rate fetching correctly', async () => {
    const mockExportInvoices = [
      { id: '1', vendorId: 'v1', currency: 'GBP' },
      { id: '2', vendorId: 'v2', currency: 'PLN' },
    ];

    fetchAllRecords.mockResolvedValue(mockExportInvoices);

    mockKy.get
      .mockImplementationOnce(() => ({
        json: jest.fn().mockResolvedValue({ from: 'GBP', to: 'USD', rate: 1.26 }),
      }))
      .mockImplementationOnce(() => ({
        json: jest.fn().mockResolvedValue({ from: 'PLN', to: 'USD', rate: 0.24 }),
      }));

    const result = await getInvoiceExportData({
      ky: mockKy,
      intl: mockIntl,
      query: mockQuery,
      currency: 'USD',
    });

    expect(result).toBe('Export Report');
    expect(createInvoiceExportReport).toHaveBeenCalledWith(
      expect.objectContaining({
        exchangeRateMap: {
          GBP: { from: 'GBP', rate: 1.26, to: 'USD' },
          PLN: { from: 'PLN', rate: 0.24, to: 'USD' },
        },
      }),
    );
  });

  it('should filter out failed exchange rate requests', async () => {
    const mockExportInvoices = [
      { id: '1', vendorId: 'v1', currency: 'USD' },
      { id: '2', vendorId: 'v2', currency: 'TJS' },
    ];

    fetchAllRecords.mockResolvedValue(mockExportInvoices);

    mockKy.get.mockImplementationOnce(() => ({
      json: jest.fn().mockResolvedValue({ from: 'USD', to: 'USD', rate: 1 }),
    }));
    mockKy.get.mockImplementationOnce(() => ({
      json: jest.fn().mockRejectedValue(new Error('Cannot convert TJS into USD: Rate Provider did not return data though at check before data was flagged as available, provider=ECB, query=ConversionQuery (\n{Query.termCurrency=USD, Query.baseCurrency=TJS})')),
    }));

    const result = await getInvoiceExportData({
      ky: mockKy,
      intl: mockIntl,
      query: mockQuery,
      currency: 'USD',
    });

    expect(result).toBe('Export Report');
    expect(createInvoiceExportReport).toHaveBeenCalledWith(
      expect.objectContaining({
        exchangeRateMap: {
          USD: { from: 'USD', rate: 1, to: 'USD' },
        },
      }),
    );
  });
});
