import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ResetButton.css';

const defaultLabel = <FormattedMessage id="stripes-acq-components.resetAllFilters" />;

const ResetButton = ({ id, disabled, label, reset }) => {
  return (
    <div>
      <Button
        buttonStyle="none"
        id={id}
        onClick={reset}
        disabled={disabled}
        buttonClass={css.resetButton}
      >
        <Icon size="small" icon="times-circle-solid">
          {label}
        </Icon>
      </Button>
    </div>
  );
};

ResetButton.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.node,
  reset: PropTypes.func.isRequired,
};

ResetButton.defaultProps = {
  label: defaultLabel,
};

export default ResetButton;
