import { getMoneyMultiplier } from './getMoneyMultiplier';

const currency = 'USD';

test('Returns correct money multiplier for USD', () => {
  const multiplier = getMoneyMultiplier(currency);

  expect(multiplier).toBe(100);
});
