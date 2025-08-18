import {
  FUNDS_API,
  LIMIT_MAX_EXTENDED,
} from '../constants';
import { baseManifest } from './base';

export const fundsManifest = {
  ...baseManifest,
  path: FUNDS_API,
  perRequest: LIMIT_MAX_EXTENDED,
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
