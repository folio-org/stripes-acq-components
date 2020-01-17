import { FUND_DISTR_TYPE } from '../constants';
import { calculateFundAmount } from './calculateFundAmount';

const fundDistr = {
  distributionType: FUND_DISTR_TYPE.percent,
  value: 14.33,
};
const totalAmount = 75.55;
const currency = 'USD';

test('Calculate amount for Fund with percentage value type', () => {
  const jsValue = (fundDistr.value * totalAmount) / 100; // 10.826315
  const calculatedAndRoundedValue = calculateFundAmount(fundDistr, totalAmount, currency);

  expect(calculatedAndRoundedValue).not.toBe(jsValue);
  expect(calculatedAndRoundedValue).toBe(10.83);
});
