import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  // ---
  code: faker.finance.account,
  name: faker.finance.accountName,
  // --- left these attrs to emulate GET finance/funds response (it's not composite funds)

  fund: () => ({
    id: faker.random.uuid(),
    name: faker.finance.accountName(),
    code: faker.finance.account(),
    fundStatus: 'Active',
    allocatedFromIds: [],
    allocatedToIds: [],
    tags: {
      tagList: [],
    },
  }),
  groupIds: [],
});
