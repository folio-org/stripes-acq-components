import React from 'react';
import PropTypes from 'prop-types';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

const OrganizationValue = ({ value, label }) => {
  return (
    <KeyValue
      label={label}
      value={value || <NoValue />}
    />
  );
};

OrganizationValue.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node,
};

export default OrganizationValue;
