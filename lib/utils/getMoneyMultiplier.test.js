import { getMoneyMultiplier } from './getMoneyMultiplier';

const stripes = { currency: 'USD', locale: 'en' };

test('Returns correct money multiplier for USD', () => {
  const multiplier = getMoneyMultiplier(stripes);

  expect(multiplier).toBe(100);
});
