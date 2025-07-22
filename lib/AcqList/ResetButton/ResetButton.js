import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './ResetButton.css';

const defaultLabel = <FormattedMessage id="stripes-acq-components.resetAllFilters" />;

const ResetButton = ({
  disabled,
  id,
  label = defaultLabel,
  reset,
}) => {
  return (
    <div>
      <Button
        data-testid="reset-button"
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

export default ResetButton;
