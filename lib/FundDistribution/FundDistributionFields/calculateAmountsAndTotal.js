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

  const percentAmounts = typedAmounts.filter(
    ({ distributionType }) => distributionType === FUND_DISTR_TYPE.percent,
  );
  const percentValuesSum = percentAmounts.reduce((acc, { value }) => acc + value, 0);

  if (percentAmounts.length > 1 && percentValuesSum === 100) {
    let remainingAmountPennies = totalAmount * multiplier - distributionTotal * multiplier;

    if (remainingAmountPennies > 0) {
      let recordIndexToChange = typedAmounts.length - 1;

      do {
        const prevAmount = typedAmounts[recordIndexToChange].amount;

        typedAmounts[recordIndexToChange].amount = (prevAmount * multiplier + 1) / multiplier;
        distributionTotal = (distributionTotal * multiplier + 1) / multiplier;
        recordIndexToChange--;
        remainingAmountPennies--;
      } while (remainingAmountPennies > 0);
    } else if (remainingAmountPennies < 0) {
      let recordIndexToChange = 0;

      do {
        const prevAmount = typedAmounts[recordIndexToChange].amount;

        typedAmounts[recordIndexToChange].amount = (prevAmount * multiplier - 1) / multiplier;
        distributionTotal = (distributionTotal * multiplier - 1) / multiplier;
        recordIndexToChange++;
        remainingAmountPennies++;
      } while (remainingAmountPennies < 0);
    }
  }
  const amounts = typedAmounts.reduce((acc, distr, index) => {
    acc[index] = distr.amount;

    return acc;
  }, {});

  return { amounts, distributionTotal };
};
