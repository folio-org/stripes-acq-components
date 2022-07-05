import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

import { TIMEZONE } from '../constants';
import { formatDate } from '../utils';

const FolioFormattedDate = ({ value, utc = true }) => {
  const intl = useIntl();
  const timezone = utc ? TIMEZONE : intl.timeZone;

  return formatDate(value, intl, timezone) || <NoValue />;
};

FolioFormattedDate.propTypes = {
  value: PropTypes.string,
  utc: PropTypes.bool,
};

export default FolioFormattedDate;
