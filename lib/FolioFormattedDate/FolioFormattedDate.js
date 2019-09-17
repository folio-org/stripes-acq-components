import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { DATE_FORMAT } from '../constants';

const FolioFormattedDate = ({ value = '' }) => {
  const momentDate = moment.utc(value);

  return momentDate.isValid() ? momentDate.format(DATE_FORMAT) : null;
};

FolioFormattedDate.propTypes = {
  value: PropTypes.string,
};

export default FolioFormattedDate;
