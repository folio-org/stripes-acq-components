import React from 'react';
import { FormattedMessage } from 'react-intl';

export function validateRequired(value) {
  return value ? undefined : <FormattedMessage id="stripes-acq-components.validation.required" />;
}

export function validateRequiredNotNegative(value) {
  return value === 0 || value > 0
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.cantBeNegativeOrEmpty" />;
}

export function validateRequiredNumber(value) {
  return value < 0 || value === 0 || value > 0
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.required" />;
}

export function validateNoSpaces(value) {
  return /^\S+$/.test(value)
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.cantContainSpaces" />;
}
