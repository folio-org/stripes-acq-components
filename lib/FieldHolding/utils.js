import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getCallNumber = ({ callNumber = '', callNumberPrefix = '', callNumberSuffix = '' }) => (
  `${callNumberPrefix}${callNumber}${callNumberSuffix}`.trim()
);

export const getHoldingLocationName = (holding = {}, locationsMap = {}) => {
  const callNumberLabel = getCallNumber(holding);
  const separator = callNumberLabel ? ' > ' : '';
  const locationName = locationsMap[holding.permanentLocationId]?.name;

  return locationName ? `${locationName}${separator}${callNumberLabel}` : <FormattedMessage id="stripes-acq-components.invalidReference" />;
};

export const getHoldingOptions = (holdings = [], locationsMap = {}) => (
  holdings.map(holding => ({
    value: holding.id,
    label: getHoldingLocationName(holding, locationsMap),
  }))
);
