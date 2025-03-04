import React from 'react';
import { FormattedMessage } from 'react-intl';

export const getCallNumber = ({ callNumber = '', callNumberPrefix = '', callNumberSuffix = '' }) => (
  `${callNumberPrefix}${callNumber}${callNumberSuffix}`.trim()
);

export const getHoldingLocationName = (
  holding = {},
  locationsMap = {},
  invalidReferenceMessage = <FormattedMessage id="stripes-acq-components.invalidReference" />,
) => {
  const callNumberLabel = getCallNumber(holding);
  const copyNumberLabel = holding.copyNumber || '';
  const separator = callNumberLabel || copyNumberLabel ? ' > ' : '';
  const locationName = locationsMap[holding.permanentLocationId]?.name;

  return locationName
    ? `${locationName}${separator}${callNumberLabel} ${copyNumberLabel}`.trim()
    : invalidReferenceMessage;
};

export const getHoldingOptions = (holdings = [], locationsMap = {}) => (
  holdings.map(holding => ({
    value: holding.id,
    label: getHoldingLocationName(holding, locationsMap),
  }))
);
