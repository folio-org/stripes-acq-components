import {
  flatten,
  uniq,
  keyBy,
} from 'lodash';

import {
  ACQUISITIONS_UNITS_API,
  BATCH_GROUPS_API,
  CONFIG_ADDRESSES,
  CONFIG_API,
  EXCHANGE_RATE_API,
  EXPENSE_CLASSES_API,
  INVOICE_LINE_API,
  INVOICES_API,
  LINES_API,
  MODULE_TENANT,
  USERS_API,
  VENDORS_API,
  VOUCHER_LINES_API,
  VOUCHERS_API,
} from '../../constants';
import { fetchAllRecords } from '../fetchAllRecords';
import { fetchExportDataByIds } from '../fetchExportDataByIds';
import { getAddresses } from '../getAddresses';
import { createInvoiceExportReport } from './createInvoiceExportReport';

export const getInvoiceExportData = async ({ ky, intl, query, currency: to }) => {
  const exportInvoices = await fetchAllRecords(
    {
      GET: async ({ params: searchParams }) => {
        const { invoices } = await ky.get(INVOICES_API, { searchParams }).json();

        return invoices;
      },
    },
    query,
  );
  const exportInvoiceIds = exportInvoices.map(({ id }) => id);
  const buildInvoiceLinesQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');
  const invoiceLines = await fetchExportDataByIds({
    ky, ids: exportInvoiceIds, buildQuery: buildInvoiceLinesQuery, api: INVOICE_LINE_API, records: 'invoiceLines',
  });
  const vendorIds = uniq(exportInvoices.map(({ vendorId }) => vendorId));
  const vendors = await fetchExportDataByIds({ ky, ids: vendorIds, api: VENDORS_API, records: 'organizations' });
  const acqUnitsIds = uniq(flatten((exportInvoices.map(({ acqUnitIds }) => acqUnitIds))));
  const acqUnits = await fetchExportDataByIds({ ky, ids: acqUnitsIds, api: ACQUISITIONS_UNITS_API, records: 'acquisitionsUnits' });
  const userIds = uniq(exportInvoices.map(({ approvedBy }) => approvedBy).filter(Boolean));
  const users = await fetchExportDataByIds({ ky, ids: userIds, api: USERS_API, records: 'users' });
  const batchGroupIds = uniq(exportInvoices.map(({ batchGroupId }) => batchGroupId));
  const batchGroups = await fetchExportDataByIds({ ky, ids: batchGroupIds, api: BATCH_GROUPS_API, records: 'batchGroups' });
  const poLineIds = uniq(invoiceLines.map(({ poLineId }) => poLineId).filter(Boolean));
  const poLines = await fetchExportDataByIds({ ky, ids: poLineIds, api: LINES_API, records: 'poLines' });
  const buildVouchersQuery = (itemsChunk) => itemsChunk.map(id => `invoiceId==${id}`).join(' or ');
  const vouchers = await fetchExportDataByIds({
    ky, ids: exportInvoiceIds, buildQuery: buildVouchersQuery, api: VOUCHERS_API, records: 'vouchers',
  });
  const voucherIds = vouchers.map(({ id }) => id);
  const buildVoucherLinesQuery = (itemsChunk) => itemsChunk.map(id => `voucherId==${id}`).join(' or ');
  const voucherLines = await fetchExportDataByIds({
    ky, ids: voucherIds, buildQuery: buildVoucherLinesQuery, api: VOUCHER_LINES_API, records: 'voucherLines',
  });
  const invoiceExpenseClassIds = flatten(exportInvoices.adjustments?.map(
    ({ fundDistributions }) => (fundDistributions?.map(({ expenseClassId }) => expenseClassId)),
  ));
  const invoiceLineExpenseClassIds = flatten(invoiceLines.map(
    ({ fundDistributions }) => (fundDistributions?.map(({ expenseClassId }) => expenseClassId)),
  ));
  const expenseClassIds = uniq([...invoiceExpenseClassIds, ...invoiceLineExpenseClassIds].filter(Boolean));
  const expenseClasses = await fetchExportDataByIds({ ky, ids: expenseClassIds, api: EXPENSE_CLASSES_API, records: 'expenseClasses' });
  const addressIds = uniq(flatten(exportInvoices.map(({ billTo }) => billTo))).filter(Boolean);
  const buildAddressQuery = (itemsChunk) => {
    const subQuery = itemsChunk
      .map(id => `id==${id}`)
      .join(' or ');

    return subQuery ? `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES} and (${subQuery}))` : '';
  };
  const addressRecords = await fetchExportDataByIds({
    ky, ids: addressIds, buildQuery: buildAddressQuery, api: CONFIG_API, records: 'configs',
  });
  const addresses = getAddresses(addressRecords);
  const currencies = uniq(exportInvoices.map(({ currency }) => currency));
  const allExchangeRates = await Promise.allSettled(
    currencies.map(from => ky.get(EXCHANGE_RATE_API, { searchParams: { from, to } }).json()),
  );
  const exchangeRates = allExchangeRates
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value);

  return (createInvoiceExportReport({
    acqUnitMap: keyBy(acqUnits, 'id'),
    addressMap: keyBy(addresses, 'id'),
    batchGroupMap: keyBy(batchGroups, 'id'),
    exchangeRateMap: keyBy(exchangeRates, 'from'),
    expenseClassMap: keyBy(expenseClasses, 'id'),
    intl,
    invoiceLines,
    invoiceMap: keyBy(exportInvoices, 'id'),
    poLineMap: keyBy(poLines, 'id'),
    userMap: keyBy(users, 'id'),
    vendorMap: keyBy(vendors, 'id'),
    voucherLines,
    vouchers,
  }));
};
