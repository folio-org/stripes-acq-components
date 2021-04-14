import React from 'react';
import PropTypes from 'prop-types';

import {
  Label,
  NoValue,
} from '@folio/stripes/components';

import css from './KeyValueInline.css';

function KeyValueInline({ label, value }) {
  const displayValue = value == null || value === '' ? <NoValue /> : value;

  return (
    <div>
      <Label className={css.inlineLabel} tagName="span">{label}</Label>: {displayValue}
    </div>
  );
}

KeyValueInline.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.number]),
};

export default KeyValueInline;
