import React from 'react';
import { FormattedMessage } from 'react-intl';
import { uniqBy } from 'lodash';

import { calculateAmountsAndTotal } from './calculateAmountsAndTotal';

export const validateFundDistributionUniqueFunds = (fundDistribution) => (
  uniqBy(fundDistribution, ({ fundId, expenseClassId }) => `${fundId}${expenseClassId}`).length !== fundDistribution.length
    ? <FormattedMessage id="stripes-acq-components.validation.fundDistribution.uniqueFunds" />
    : undefined
);

export const validateFundDistributionTotal = (fundDistribution, totalAmount, currency) => {
  const { distributionTotal } = calculateAmountsAndTotal(fundDistribution, totalAmount, currency);

  return new Promise((resolve, reject) => {
    return distributionTotal !== totalAmount
      // eslint-disable-next-line prefer-promise-reject-errors
      ? reject({
        errors: [{
          code: 'incorrectFundDistributionTotal',
          parameters: [{ key: 'remainingAmount', value: totalAmount - distributionTotal }],
        }],
      })
      : resolve();
  });
};
