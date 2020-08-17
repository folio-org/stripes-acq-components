import React from 'react';
import { FormattedMessage } from 'react-intl';

const REGEXP_URL = new RegExp('^$|([Hh][Tt][Tt][Pp]|[Ff][Tt][Pp])([Ss])?://.+$');

export const validateURL = value => {
  const isValid = REGEXP_URL.test(value);

  if (value === undefined || isValid) return undefined;

  return <FormattedMessage id="stripes-acq-components.validation.invalidURL" />;
};
