import React from 'react';
import { FormattedMessage } from 'react-intl';

import { calculateFundAmount } from './calculateFundAmount';

// eslint-disable-next-line import/prefer-default-export
export function validateFundDistribution(fundDistribution, totalAmount) {
  if (fundDistribution && fundDistribution.length) {
    const sumAmounts = fundDistribution.reduce((acc, distr) => acc + calculateFundAmount(distr, totalAmount), 0);

    if (sumAmounts !== totalAmount) {
      return { _error: <FormattedMessage id="stripes-acq-components.validation.shouldBeEqualToTotalAmount" /> };
    }
  }

  return null;
}
