import React from 'react';
import { FormattedMessage } from 'react-intl';

const REGEXP_URL = new RegExp('^$|([Hh][Tt][Tt][Pp]|[Ff][Tt][Pp])([Ss])?://.+$');

export const validateURL = value => {
  if (value === undefined || REGEXP_URL.test(value)) return undefined;

  return <FormattedMessage id="stripes-acq-components.validation.invalidURL" />;
};
