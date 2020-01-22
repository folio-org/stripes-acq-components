import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.address.country,
  code: faker.address.countryCode,
});
