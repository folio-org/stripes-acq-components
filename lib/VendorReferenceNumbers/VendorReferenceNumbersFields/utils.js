import React from 'react';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';

const REQUIRED = <FormattedMessage id="stripes-acq-components.validation.required" />;

// Field is required only if 'refNumber' isn't empty
export const requiredRefNumber = (value, allValues, field) => {
  const refNumber = get(allValues, `${field}.refNumber`);

  return refNumber && !value
    ? REQUIRED
    : undefined;
};

// Field is required only if 'refNumberType' isn't empty
export const requiredRefNumberType = (value, allValues, field) => {
  const refNumberType = get(allValues, `${field}.refNumberType`);

  return refNumberType && !value
    ? REQUIRED
    : undefined;
};
