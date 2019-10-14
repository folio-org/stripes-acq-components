import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function validateFundDistribution(fundDistribution) {
  let errors = null;

  if (fundDistribution && fundDistribution.length) {
    const fundDistributionErrors = [];
    const firstDistrType = fundDistribution[0].distributionType;

    fundDistribution.forEach((distr, index) => {
      const distrErrors = {};

      if (distr.distributionType && distr.distributionType !== firstDistrType) {
        distrErrors.value = <FormattedMessage id="stripes-acq-components.validation.fundDistributionType" />;
        fundDistributionErrors[index] = distrErrors;
      }
    });

    if (fundDistributionErrors.length) errors = fundDistributionErrors;
  }

  return errors;
}
