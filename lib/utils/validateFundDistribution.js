import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function validateFundDistribution(fundDistribution) {
  if (fundDistribution && fundDistribution.length) {
    const firstDistrType = fundDistribution[0].distributionType;
    const hasDifferentTypes = fundDistribution.some(
      ({ distributionType }) => distributionType && distributionType !== firstDistrType,
    );

    if (hasDifferentTypes) return { _error: <FormattedMessage id="stripes-acq-components.validation.fundDistributionType" /> };
  }

  return null;
}
