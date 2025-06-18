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

it('should return export report object', () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  expect(createInvoiceExportReport({
    acqUnitMap: keyBy([acqUnit], 'id'),
    addressMap: keyBy([address], 'id'),
    exchangeRateMap: { [invoice.currency]: { from: invoice.currency, exchangeRate: 1 } },
    expenseClassMap: {},
    intl,
    invoiceLines: [invoiceLine],
    batchGroupMap: keyBy([batchGroup], 'id'),
    invoiceMap: keyBy([invoice], 'id'),
    poLineMap: keyBy([orderLine], 'id'),
    userMap: {},
    vendorMap: keyBy([vendor], 'id'),
  })).toEqual(invoiceExportReport);
});
