import { get } from 'lodash';

import { FUND_DISTR_TYPE } from '../constants';
import { getMoneyMultiplier } from './getMoneyMultiplier';

export const calculateFundAmount = (fundDistr, totalAmount, currency) => {
  const fundDistributionValue = Number(get(fundDistr, 'value') || 0);
  const fundDistributionType = get(fundDistr, 'distributionType') || FUND_DISTR_TYPE.percent;
  const multiplier = getMoneyMultiplier(currency);

  const amount = fundDistributionType === FUND_DISTR_TYPE.percent
    ? Math.round(fundDistributionValue * totalAmount * 100) / 10000
    : fundDistributionValue;

  return Math.round(amount * multiplier) / multiplier;
};
