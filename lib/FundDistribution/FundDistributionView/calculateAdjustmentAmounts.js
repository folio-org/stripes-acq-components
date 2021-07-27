import { flatten } from 'lodash';

import { calculateAmountsAndTotal } from '../FundDistributionFields/calculateAmountsAndTotal';

export const calculateAdjustmentAmounts = (fundDistributions, groupBy, currency) => {
  const adjustmentFundDistributions = fundDistributions.reduce((acc, fundDistribution) => {
    acc[fundDistribution[groupBy]] = acc[fundDistribution[groupBy]] || [];
    acc[fundDistribution[groupBy]].push(fundDistribution);

    return acc;
  }, {});

  const adjustmentAmounts = Object.values(adjustmentFundDistributions).map(fundDistribution => (
    calculateAmountsAndTotal(fundDistribution, fundDistribution?.[0]?.totalAmount || 0, currency)
  ));
  const amounts = flatten(adjustmentAmounts.map(adjustment => Object.values(adjustment.amounts)));

  return { amounts };
};
