import { calculateFundAmount } from './calculateFundAmount';
import { getMoneyMultiplier } from './getMoneyMultiplier';

export function calculateFundDistributionTotal(fundDistribution, totalAmount, currency) {
  if (!currency) return 0;
  const multiplier = getMoneyMultiplier(currency);
  const sumAmounts = Math.round(fundDistribution.reduce(
    (acc, distr) => acc + calculateFundAmount(distr, totalAmount, currency),
    0,
  ) * multiplier) / multiplier;

  return sumAmounts;
}
