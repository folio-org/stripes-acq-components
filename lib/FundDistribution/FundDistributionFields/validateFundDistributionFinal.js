import React from 'react';
import { FormattedMessage } from 'react-intl';
import { uniqBy } from 'lodash';

import { calculateAmountsAndTotal } from './calculateAmountsAndTotal';

export function validateFundDistributionFinal(fundDistribution, totalAmount, currency) {
  if (totalAmount != null && fundDistribution?.length) {
    if (uniqBy(fundDistribution, ({ fundId, expenseClassId }) => `${fundId}${expenseClassId}`).length !== fundDistribution.length) {
      return <FormattedMessage id="stripes-acq-components.validation.fundDistribution.uniqueFunds" />;
    }
    const { distributionTotal } = calculateAmountsAndTotal(fundDistribution, totalAmount, currency);

    if (distributionTotal !== totalAmount) {
      return <FormattedMessage id="stripes-acq-components.validation.shouldBeEqualToTotalAmount" />;
    }
  }

  return undefined;
}
