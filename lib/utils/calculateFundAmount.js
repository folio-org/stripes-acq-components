import { get } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const calculateFundAmount = (fund, totalAmount) => {
  const fundDistributionPercentage = get(fund, 'percentage', 0);

  return (fundDistributionPercentage / 100) * totalAmount;
};
