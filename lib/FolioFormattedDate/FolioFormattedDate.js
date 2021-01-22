import React from 'react';
import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';

import { formatDate } from '../utils';

const FolioFormattedDate = ({ value }) => {
  return formatDate(value) || <NoValue />;
};

FolioFormattedDate.propTypes = {
  value: PropTypes.string,
};

export default FolioFormattedDate;
