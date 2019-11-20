import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  label: faker.commerce.product,
  description: faker.lorem.paragraph,
});
