import {
  calculateFundAmount,
  getMoneyMultiplier,
} from '../../utils';
import { FUND_DISTR_TYPE } from '../../constants';

export const calculateAmountsAndTotal = (fundDistribution, totalAmount, currency) => {
  if (!currency) return { amounts: {}, distributionTotal: 0 };

  const typedAmounts = fundDistribution.map((distr, index) => ({
    ...distr,
    amount: calculateFundAmount(distr, totalAmount, currency),
    index,
  }));

  const multiplier = getMoneyMultiplier(currency);

  let distributionTotal = Math.round(typedAmounts.reduce(
    (acc, { amount }) => acc + amount,
    0,
  ) * multiplier) / multiplier;

  const remainingAmountPennies = totalAmount * multiplier - distributionTotal * multiplier;
  const percentAmounts = typedAmounts.filter(
    ({ distributionType }) => distributionType === FUND_DISTR_TYPE.percent,
  );

  if (remainingAmountPennies === 1) {
    if (percentAmounts.length > 1) {
      const recordIndexToChange = percentAmounts[0].index;
      const prevAmount = typedAmounts[recordIndexToChange].amount;

      typedAmounts[recordIndexToChange].amount = (prevAmount * multiplier + 1) / multiplier;
      distributionTotal = (distributionTotal * multiplier + 1) / multiplier;
    }
  } else if (remainingAmountPennies === -1) {
    if (percentAmounts.length > 1) {
      const recordIndexToChange = percentAmounts[percentAmounts.length - 1].index;
      const prevAmount = typedAmounts[recordIndexToChange].amount;

      typedAmounts[percentAmounts.length - 1].amount = (prevAmount * multiplier - 1) / multiplier;
      distributionTotal = (distributionTotal * multiplier - 1) / multiplier;
    }
  }
  const amounts = typedAmounts.reduce((acc, distr, index) => {
    acc[index] = distr.amount;

    return acc;
  }, {});

  return { amounts, distributionTotal };
};
