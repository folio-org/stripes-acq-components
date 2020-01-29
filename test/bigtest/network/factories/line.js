import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: () => faker.random.uuid(),
  purchaseOrderId: () => faker.random.uuid(),
  poLineNumber: () => faker.finance.account(),
  metadata: () => ({
    createdDate: faker.date.past(),
    updatedDate: faker.date.past(),
  }),
  contributors: [],
  details: {
    productIds: [],
  },
  locations: [],
  receiptDate: () => faker.date.future(),
});
