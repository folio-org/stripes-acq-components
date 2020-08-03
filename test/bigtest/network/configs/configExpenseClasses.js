import {
  createGetAll,
  createGetById,
} from './utils';

import { EXPENSE_CLASSES_API } from '../../../../lib';

const SCHEMA_NAME = 'expenseClasses';

const configExpenseClasses = server => {
  server.get(EXPENSE_CLASSES_API, createGetAll(SCHEMA_NAME));
  server.get(`${EXPENSE_CLASSES_API}/:id`, createGetById(SCHEMA_NAME));
};

export default configExpenseClasses;
