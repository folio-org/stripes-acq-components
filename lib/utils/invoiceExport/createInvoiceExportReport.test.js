import keyBy from 'lodash/keyBy';
import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { createInvoiceExportReport } from './createInvoiceExportReport';
import {
  acqUnit,
  address,
  batchGroup,
  invoiceExportReport,
  invoice,
  invoiceLine,
  orderLine,
  vendor,
} from '../../../test/jest/fixtures';

const invoiceToExport = {
  ...invoice,
  adjustments: [
    {
      description: '1',
      exportToAccounting: false,
      fundDistributions: [
        {
          code: 'TSTFND',
          distributionType: 'amount',
          expenseClassId: 'expenseClassId',
          fundId: 'd82eea02-ca5f-473c-95b3-917f40ad09a8',
          value: 1,
        },
        {
          code: 'TSTFND2',
          distributionType: 'amount',
          fundId: '15b128d5-517d-4fd3-8060-59580d3f92bf',
          value: 1,
        },
      ],
      id: 'fb52d388-433e-4fc1-8ec7-cc2a82213c5a',
      prorate: 'Not prorated',
      relationToTotal: 'In addition to',
      type: 'Amount',
      value: 2,
    },
    {
      description: '2',
      exportToAccounting: false,
      fundDistributions: [],
      id: '98a5f216-805c-4bbd-b674-041b9a81d354',
      prorate: 'By amount',
      relationToTotal: 'Included in',
      type: 'Amount',
      value: 1,
    },
  ],
};

const exportResults = [{
  ...invoiceExportReport[0],
  invoiceAdjustments: '"1""2""Not prorated""In addition to""false" | "2""1""By amount""Included in""false"',
  invoiceFundDistributions: '"TSTFND""Expense class""1""1" | "TSTFND2""""1""1"',
}];

it('should return export report object', () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  expect(createInvoiceExportReport({
    acqUnitMap: keyBy([acqUnit], 'id'),
    addressMap: keyBy([address], 'id'),
    exchangeRateMap: { [invoice.currency]: { from: invoice.currency, exchangeRate: 1 } },
    expenseClassMap: {
      expenseClassId: { name: 'Expense class' },
    },
    intl,
    invoiceLines: [invoiceLine],
    batchGroupMap: keyBy([batchGroup], 'id'),
    invoiceMap: keyBy([invoiceToExport], 'id'),
    poLineMap: keyBy([orderLine], 'id'),
    userMap: {},
    vendorMap: keyBy([vendor], 'id'),
  })).toEqual(exportResults);
});
