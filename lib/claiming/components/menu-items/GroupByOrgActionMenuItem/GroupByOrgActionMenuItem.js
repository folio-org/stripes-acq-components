import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

export const GroupByOrgActionMenuItem = ({
  onClick,
}) => {
  return (
    <Button
      data-testid="group-by-org-button"
      buttonStyle="dropdownItem"
      onClick={onClick}
    >
      <Icon icon="house">
        <FormattedMessage id="stripes-acq-components.claiming.action.groupByOrganization" />
      </Icon>
    </Button>
  );
};

GroupByOrgActionMenuItem.propTypes = {
  onClick: PropTypes.func.isRequired,
};
