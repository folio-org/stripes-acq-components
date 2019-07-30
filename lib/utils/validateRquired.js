import React from 'react';
import { FormattedMessage } from 'react-intl';

// eslint-disable-next-line import/prefer-default-export
export function validateRequired(value) {
  return value ? undefined : <FormattedMessage id="stripes-acq-components.validation.required" />;
}
