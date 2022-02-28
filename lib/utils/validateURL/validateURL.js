import React from 'react';
import { FormattedMessage } from 'react-intl';

import { validateRequired } from '../validateRequired';

const REGEXP_URL = /^$|([Hh][Tt][Tt][Pp]|[Ff][Tt][Pp])([Ss])?:\/\/.+$/;

export const validateURL = value => {
  if (value === undefined || REGEXP_URL.test(value)) return undefined;

  return <FormattedMessage id="stripes-acq-components.validation.invalidURL" />;
};

export const validateURLRequired = value => validateRequired(value) || validateURL(value);
