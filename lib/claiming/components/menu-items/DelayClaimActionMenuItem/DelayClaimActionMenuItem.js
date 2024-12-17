import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const DelayClaimActionMenuItem = ({
  disabled,
  onClick,
}) => {
  return (
    <Button
      data-testid="delay-claim-button"
      disabled={disabled}
      buttonStyle="dropdownItem"
      onClick={onClick}
    >
      <Icon icon="calendar">
        <FormattedMessage id="stripes-acq-components.claiming.action.delayClaim" />
      </Icon>
    </Button>
  );
};

DelayClaimActionMenuItem.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
