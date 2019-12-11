import React from 'react';
import { FormattedMessage } from 'react-intl';
import { uniqBy } from 'lodash';

import { calculateFundDistributionTotal } from './calculateFundDistributionTotal';

export function validateFundDistribution(fundDistribution, totalAmount, stripes, currency) {
  if (fundDistribution && fundDistribution.length) {
    if (uniqBy(fundDistribution, 'fundId').length !== fundDistribution.length) {
      return { _error: <FormattedMessage id="stripes-acq-components.validation.fundDistribution.uniqueFunds" /> };
    }
    const sumAmounts = calculateFundDistributionTotal(fundDistribution, totalAmount, stripes, currency);

    if (sumAmounts !== totalAmount) {
      return { _error: <FormattedMessage id="stripes-acq-components.validation.shouldBeEqualToTotalAmount" /> };
    }
  }

  return null;
}
