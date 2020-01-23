import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  label: faker.commerce.product,
  description: faker.lorem.paragraph,
});
