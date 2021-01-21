import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

import { formatDateTime } from '../utils';

const FolioFormattedTime = ({ dateString }) => {
  const intl = useIntl();

  return formatDateTime(dateString, intl) || <NoValue />;
};

FolioFormattedTime.propTypes = {
  dateString: PropTypes.string,
};

export default FolioFormattedTime;
