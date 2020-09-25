import React from 'react';
import { FormattedMessage } from 'react-intl';
import { uniqBy } from 'lodash';

import { calculateFundDistributionTotal } from './calculateFundDistributionTotal';

export function validateFundDistributionFinal(fundDistribution, totalAmount, currency) {
  if (fundDistribution && fundDistribution.length) {
    if (uniqBy(fundDistribution, ({ fundId, expenseClassId }) => `${fundId}${expenseClassId}`).length !== fundDistribution.length) {
      return <FormattedMessage id="stripes-acq-components.validation.fundDistribution.uniqueFunds" />;
    }
    const sumAmounts = calculateFundDistributionTotal(fundDistribution, totalAmount, currency);

    if (sumAmounts !== totalAmount) {
      return <FormattedMessage id="stripes-acq-components.validation.shouldBeEqualToTotalAmount" />;
    }
  }

  return undefined;
}
