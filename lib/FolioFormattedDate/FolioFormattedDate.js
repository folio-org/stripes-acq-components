import React from 'react';
import { FormattedDate } from 'react-intl';
import PropTypes from 'prop-types';

const FolioFormattedDate = (props) => {
  return props.value
    ? <FormattedDate {...props} />
    : null;
};

FolioFormattedDate.propTypes = {
  day: PropTypes.string,
  month: PropTypes.string,
  value: PropTypes.string,
  year: PropTypes.string,
};

FolioFormattedDate.defaultProps = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
};

export default FolioFormattedDate;
