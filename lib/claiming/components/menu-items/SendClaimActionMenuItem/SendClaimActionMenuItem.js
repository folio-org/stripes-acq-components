import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const SendClaimActionMenuItem = ({
  disabled,
  onClick,
}) => {
  return (
    <Button
      disabled={disabled}
      buttonStyle="dropdownItem"
      data-testid="send-claim-button"
      onClick={onClick}
    >
      <Icon icon="envelope">
        <FormattedMessage id="stripes-acq-components.claiming.action.sendClaim" />
      </Icon>
    </Button>
  );
};

SendClaimActionMenuItem.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
