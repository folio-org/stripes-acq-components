import { EXPENSE_CLASSES_API } from '../constants';
import { baseManifest } from './base';

export const expenseClassesManifest = {
  ...baseManifest,
  path: EXPENSE_CLASSES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'expenseClasses',
};
