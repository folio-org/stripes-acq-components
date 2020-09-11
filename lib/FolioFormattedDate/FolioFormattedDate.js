import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { NoValue } from '@folio/stripes/components';

import { DATE_FORMAT } from '../constants';

const FolioFormattedDate = ({ value }) => {
  if (!value) return <NoValue />;

  const momentDate = moment.utc(value);

  return momentDate.isValid() ? momentDate.format(DATE_FORMAT) : <NoValue />;
};

FolioFormattedDate.propTypes = {
  value: PropTypes.string,
};

export default FolioFormattedDate;
