import { FUND_DISTR_TYPE } from '../../constants';
import { calculateAmountsAndTotal } from './calculateAmountsAndTotal';

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
const currency = 'USD';

describe('calculateAmountsAndTotal', () => {
  it('Calculate total amount for Fund distribution', () => {
    const jsValue = (fundDistributions[0].value * totalAmount) / 100 + fundDistributions[1].value; // 25.156315
    const { distributionTotal } = calculateAmountsAndTotal(fundDistributions, totalAmount, currency);

    expect(distributionTotal).not.toBe(jsValue);
    expect(distributionTotal).toBe(25.16);
  });

  it('remove extra penny from the latest distribution', () => {
    const distributions = [
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 50,
      },
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 50,
      },
    ];

    const { amounts, distributionTotal } = calculateAmountsAndTotal(distributions, 0.25, currency);

    expect(distributionTotal).toBe(0.25);
    expect(amounts[0]).toBe(0.12);
    expect(amounts[1]).toBe(0.13);
  });

  it('should not change amounts if percentage amounts less than 2', () => {
    const distributions = [
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 50,
      },
      {
        distributionType: FUND_DISTR_TYPE.amount,
        value: 0.13,
      },
    ];

    const { amounts, distributionTotal } = calculateAmountsAndTotal(distributions, 0.25, currency);

    expect(distributionTotal).toBe(0.26);
    expect(amounts[0]).toBe(0.13);
    expect(amounts[1]).toBe(0.13);
  });

  it('should remove several extra pennies from the last records', () => {
    const distributions = [
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 25,
      },
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 25,
      },
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 25,
      },
      {
        distributionType: FUND_DISTR_TYPE.percent,
        value: 25,
      },
    ];

    const { amounts, distributionTotal } = calculateAmountsAndTotal(distributions, 1.98, currency);

    expect(distributionTotal).toBe(1.98);
    expect(amounts).toEqual({ '0': 0.49, '1': 0.49, '2': 0.5, '3': 0.5 });
  });
});
