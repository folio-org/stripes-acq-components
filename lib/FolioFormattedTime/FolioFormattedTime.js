import React from 'react';
import PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';

import { NoValue } from '@folio/stripes/components';

const FolioFormattedTime = ({ dateString }) => {
  return dateString
    ? (
      <FormattedTime
        day="numeric"
        month="numeric"
        timeZoneName="short"
        value={dateString}
        year="numeric"
      />
    )
    : <NoValue />;
};

FolioFormattedTime.propTypes = {
  dateString: PropTypes.string,
};

export default FolioFormattedTime;
