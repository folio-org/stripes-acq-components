import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

import { formatDate } from '../utils';

const FolioFormattedDate = ({ value }) => {
  const intl = useIntl();

  return formatDate(value, intl) || <NoValue />;
};

FolioFormattedDate.propTypes = {
  value: PropTypes.string,
};

export default FolioFormattedDate;
