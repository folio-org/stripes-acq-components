import { FUNDS_API } from '../constants';
import { baseManifest } from './base';

export const fundsManifest = {
  ...baseManifest,
  path: FUNDS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'funds',
};

export const fundExpenseClassesManifest = {
  ...baseManifest,
  // path: 'finance/funds/{id}/expense-classes',
  accumulate: true,
  fetch: false,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  // records: 'expenseClasses',
};
