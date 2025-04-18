export const FOLIO_EXPORT_TYPE = {
  CIRCULATION_LOG: 'CIRCULATION_LOG',
  BURSAR_FEES_FINES: 'BURSAR_FEES_FINES',
  BATCH_VOUCHER_EXPORT: 'BATCH_VOUCHER_EXPORT',
  EDIFACT_ORDERS_EXPORT: 'EDIFACT_ORDERS_EXPORT',
  CLAIMS: 'CLAIMS',
  ORDERS_EXPORT: 'ORDERS_EXPORT',
  INVOICE_EXPORT: 'INVOICE_EXPORT',
  BULK_EDIT_IDENTIFIERS: 'BULK_EDIT_IDENTIFIERS',
  BULK_EDIT_QUERY: 'BULK_EDIT_QUERY',
  BULK_EDIT_UPDATE: 'BULK_EDIT_UPDATE',
  E_HOLDINGS: 'E_HOLDINGS',
  AUTH_HEADINGS_UPDATES: 'AUTH_HEADINGS_UPDATES',
  FAILED_LINKED_BIB_UPDATES: 'FAILED_LINKED_BIB_UPDATES',
};

export const ORGANIZATION_INTEGRATION_EXPORT_TYPES = [
  FOLIO_EXPORT_TYPE.CLAIMS,
  FOLIO_EXPORT_TYPE.EDIFACT_ORDERS_EXPORT,
];
