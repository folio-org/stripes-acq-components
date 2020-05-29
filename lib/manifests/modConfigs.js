import {
  CONFIG_API,
  CONFIG_LOAN_TYPE,
  LIMIT_MAX,
  MODULE_ORDERS,
} from '../constants';
import { baseManifest } from './base';

export const configLoanTypeResource = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      limit: `${LIMIT_MAX}`,
      query: `(module=${MODULE_ORDERS} and configName=${CONFIG_LOAN_TYPE})`,
    },
  },
};
