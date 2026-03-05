import { ADJUSTMENT_TYPE_VALUES } from '../constants';
import { calculateAdjustmentAmount } from './calculateAdjustmentAmount';

const currency = 'USD';

const adjustment = {
  id: 'cd5c327c-1b6c-4273-a5c6-0ea0a21c426d',
  description: 'Test',
  exportToAccounting: false,
  fundDistributions: [
    {
      code: 'AFRICAHIST',
      fundId: '7fbd5d84-62d1-44c6-9c45-6cb173998bbd',
      distributionType: 'percentage',
      expenseClassId: '1bcc3247-99bf-4dca-9b0f-7bc51a2998c2',
      value: 50,
    },
    {
      code: 'ASIAHIST',
      fundId: '55f48dc6-efa7-4cfe-bc7c-4786efe493e3',
      distributionType: 'amount',
      value: 7,
    },
    {
      code: 'CANHIST',
      fundId: '68872d8a-bf16-420b-829f-206da38f6c10',
      distributionType: 'amount',
      value: 8,
    },
  ],
  prorate: 'Not prorated',
  relationToTotal: 'In addition to',
  type: ADJUSTMENT_TYPE_VALUES.amount,
  value: 30,
};

describe('calculateAdjustmentAmount', () => {
  it.each([
    [ADJUSTMENT_TYPE_VALUES.amount, adjustment.value],
    [ADJUSTMENT_TYPE_VALUES.percent, 300],
  ])('should calculate adjustment for "%s" type', (type, expected) => {
    const invoiceSubTotal = 1000;

    expect(calculateAdjustmentAmount({ ...adjustment, type }, invoiceSubTotal, currency)).toBe(expected);
  });
});
