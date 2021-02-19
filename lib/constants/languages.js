import React from 'react';
import { FormattedMessage } from 'react-intl';

import { languages } from '@folio/stripes/components';

export const LANG_LABEL_BY_CODE = languages.reduce(
  (map, d) => (
    Object.assign(
      map,
      {
        [d.alpha3]: (
          <FormattedMessage
            id={`stripes-components.languages.${d.alpha3}`}
            defaultMessage={d.name}
          />
        ),
      },
    )),
  {},
);
