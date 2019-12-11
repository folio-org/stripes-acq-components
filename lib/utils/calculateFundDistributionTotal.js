import { calculateFundAmount } from './calculateFundAmount';
import { getMoneyMultiplier } from './getMoneyMultiplier';

export function calculateFundDistributionTotal(fundDistribution, totalAmount, stripes, currency) {
  const multiplier = getMoneyMultiplier(stripes, currency);
  const sumAmounts = Math.round(fundDistribution.reduce(
    (acc, distr) => acc + calculateFundAmount(distr, totalAmount, stripes, currency),
    0,
  ) * multiplier) / multiplier;

  return sumAmounts;
}
