import { get } from 'lodash';

import { FUND_DISTR_TYPE } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const calculateFundAmount = (fundDistr, totalAmount = 0) => {
  const fundDistributionValue = get(fundDistr, 'value') || 0;
  const fundDistributionType = get(fundDistr, 'distributionType') || FUND_DISTR_TYPE.percent;

  return fundDistributionType === FUND_DISTR_TYPE.percent
    ? fundDistributionValue * totalAmount / 100
    : fundDistributionValue;
};
