import React from 'react';
import { FormattedMessage } from 'react-intl';

import { countries } from '@folio/stripes/components';

export const COUNTRY_LABEL_BY_CODE = countries.reduce(
  (map, c) => (
    Object.assign(
      map,
      { [c.alpha3]: <FormattedMessage id={`stripes-components.countries.${c.alpha2}`} /> },
    )),
  {},
);
