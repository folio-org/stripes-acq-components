import { FUNDS_API } from '../../../../lib';

const configFunds = server => {
  server.get(FUNDS_API, (schema) => {
    return schema.funds.all();
  });
};

export default configFunds;
