import { FUNDS_API } from '../../../../lib';
import CQLParser from '../cql';
import {
  createGetById,
  createPost,
  createPut,
} from './utils';

const SCHEMA_NAME = 'funds';

const configFunds = server => {
  server.get(FUNDS_API, ({ funds }, request) => {
    const cqlParser = new CQLParser();

    cqlParser.parse(request.queryParams.query);
    const { field, term } = cqlParser.tree;

    if (field && term && field !== 'cql.allRecords') {
      return funds.where({ [field]: term });
    }

    return funds.all();
  });
  server.get(`${FUNDS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(FUNDS_API, createPost(SCHEMA_NAME));
  server.put(`${FUNDS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${FUNDS_API}/:id`, SCHEMA_NAME);
};

export default configFunds;
