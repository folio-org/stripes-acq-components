import { renderHook } from '@testing-library/react-hooks';
import { useIntl } from 'react-intl';

import { getInvoiceExportData } from './getInvoiceExportData';

jest.mock('./createInvoiceExportReport', () => ({
  createInvoiceExportReport: jest.fn().mockReturnValue('test report'),
}));

test('should create export report', async () => {
  const { result } = renderHook(() => useIntl());
  const intl = result.current;

  const report = await getInvoiceExportData({ intl });

  expect(report).toEqual('test report');
});
