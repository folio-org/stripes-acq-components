import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const MarkUnreceivableActionMenuItem = ({
  disabled,
  onClick,
}) => {
  return (
    <Button
      data-testid="unreceivable-button"
      disabled={disabled}
      buttonStyle="dropdownItem"
      onClick={onClick}
    >
      <Icon icon="cancel">
        <FormattedMessage id="stripes-acq-components.claiming.action.unreceivable" />
      </Icon>
    </Button>
  );
};

MarkUnreceivableActionMenuItem.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
