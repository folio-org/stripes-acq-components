import { Response } from 'miragejs';

import { TRANSACTIONS_API } from '../../../../lib';
import { createGetAll } from './utils';

export const TRANSACTIONS_SCHEMA_NAME = 'transactions';

export const configTransactions = server => {
  server.get(TRANSACTIONS_API, createGetAll(TRANSACTIONS_SCHEMA_NAME));

  server.get(`${TRANSACTIONS_API}/:id`, (schema, request) => {
    const transactionSchema = schema.transactions.find(request.params.id);

    if (!transactionSchema) {
      return new Response(404, {
        'X-Okapi-Token': `myOkapiToken:${Date.now()}`,
      }, {});
    }

    return transactionSchema.attrs;
  });
};
