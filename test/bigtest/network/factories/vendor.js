import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  name: () => faker.company.companyName(),
  code: faker.random.word,
  isVendor: true,
  status: 'Active',
  accounts: [],
});
