import React from 'react';
import { FormattedMessage } from 'react-intl';

const sources = {
  user: 'User',
  api: 'API',
  edi: 'EDI',
  marc: 'MARC',
};

// eslint-disable-next-line import/prefer-default-export
export const sourceOptions = Object.keys(sources).map(source => ({
  value: sources[source],
  label: <FormattedMessage id={`stripes-acq-components.sources.${source}`} />,
}));
