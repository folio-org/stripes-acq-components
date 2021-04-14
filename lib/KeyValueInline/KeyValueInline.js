import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  NoValue,
} from '@folio/stripes/components';

function KeyValueInline({ label, value }) {
  const displayValue = value == null || value === '' ? <NoValue /> : value;

  return (
    <div>
      <Label style={{ display: 'inline' }} tagName="span">{label}</Label>: {displayValue}
    </div>
  );
}

KeyValueInline.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.number]),
};

export default KeyValueInline;
