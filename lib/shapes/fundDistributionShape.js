import PropTypes from 'prop-types';

import { FUND_DISTR_TYPE } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const fundDistributionShape = PropTypes.arrayOf(PropTypes.shape({
  adjustmentDescription: PropTypes.string,
  code: PropTypes.string,
  distributionType: PropTypes.oneOf(Object.values(FUND_DISTR_TYPE)),
  encumbrance: PropTypes.string,
  expenseClassId: PropTypes.string,
  fundId: PropTypes.string,
  totalAmount: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}));
