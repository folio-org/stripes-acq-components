import {
  TRANSACTIONS_API,
} from '../constants';

import { baseManifest } from './base';

export const transactionsManifest = {
  ...baseManifest,
  path: TRANSACTIONS_API,
  records: 'transactions',
  accumulate: true,
};
