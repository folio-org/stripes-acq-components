import React from 'react';
import { FormattedMessage } from 'react-intl';

export function validateRequired(value) {
  return value ? undefined : <FormattedMessage id="stripes-acq-components.validation.required" />;
}

export function validateRequiredNotNegative(value) {
  return parseFloat(value) === 0 || value > 0
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

// Validation for Fields with type 'number' requires positive integer
export function validateRequiredPositiveNumber(value) {
  return value >= 1
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.shouldBePositive" />;
}

export function validateRequiredPositiveAmount(value) {
  return value > 0
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.shouldBePositiveAmount" />;
}

export const validateRequiredMinNumber = ({ minNumber, value }) => {
  return value >= minNumber
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.shouldBeGreaterThan" values={{ minNumber }} />;
};

export const validateRequiredMaxNumber = ({ maxNumber, value }) => {
  return value <= maxNumber
    ? undefined
    : <FormattedMessage id="stripes-acq-components.validation.shouldBeLessThan" values={{ maxNumber }} />;
};
