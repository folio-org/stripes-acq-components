import React from 'react';
import { FormattedMessage } from 'react-intl';

export const sourceValues = {
  user: 'User',
  api: 'API',
  edi: 'EDI',
  marc: 'MARC',
};

const labelReducer = (acc, sourceKey) => {
  acc[sourceValues[sourceKey]] = <FormattedMessage id={`stripes-acq-components.sources.${sourceKey}`} />;

  return acc;
};

export const sourceLabels = Object.keys(sourceValues).reduce(labelReducer, {});

export const sourceOptions = Object.keys(sourceValues).map(sourceKey => ({
  value: sourceValues[sourceKey],
  label: sourceLabels[sourceValues[sourceKey]],
}));
