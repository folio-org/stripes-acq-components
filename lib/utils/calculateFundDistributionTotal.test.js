import { FUND_DISTR_TYPE } from '../constants';
import { calculateFundDistributionTotal } from './calculateFundDistributionTotal';

const fundDistributions = [
  {
    distributionType: FUND_DISTR_TYPE.percent,
    value: 14.33,
  },
  {
    distributionType: FUND_DISTR_TYPE.amount,
    value: 14.33,
  },
];
const totalAmount = 75.55;
const stripes = { currency: 'USD', locale: 'en' };

test('Calculate total amount for Fund distribution', () => {
  const jsValue = fundDistributions[0].value * totalAmount / 100 + fundDistributions[1].value; // 25.156315
  const calculatedAndRoundedValue = calculateFundDistributionTotal(fundDistributions, totalAmount, stripes);

  expect(calculatedAndRoundedValue).not.toBe(jsValue);
  expect(calculatedAndRoundedValue).toBe(25.16);
});
