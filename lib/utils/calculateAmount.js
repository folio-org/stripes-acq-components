import { get } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const calculateAmount = (fund, price) => {
  const fundDistributionPercentage = get(fund, 'percentage', 0);

  return ((fundDistributionPercentage / 100) * price).toFixed(2);
};
