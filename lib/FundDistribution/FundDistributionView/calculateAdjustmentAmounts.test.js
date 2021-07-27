import { FUND_DISTR_TYPE } from '../../constants';
import { calculateAdjustmentAmounts } from './calculateAdjustmentAmounts';

const totalAmount = 100;
const fundDistributions = [
  {
    distributionType: FUND_DISTR_TYPE.percent,
    value: 100,
    adjustmentId: 'adjustmentId',
    totalAmount: 100,
  },
];
const currency = 'USD';

describe('calculateAdjustmentAmounts', () => {
  it('Calculate amounts for Adjustment fund distribution', () => {
    const { amounts } = calculateAdjustmentAmounts(fundDistributions, 'adjustmentId', currency);

    expect(amounts[0]).toBe(totalAmount);
  });
});
