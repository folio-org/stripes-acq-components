import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';
import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import { PRIVILEGED_CONTACT_URL } from './constants';

export const PrivilegedDonorContactsLookup = ({
  onAddContacts,
  orgId,
  searchButtonStyle: searchButtonStyleProp,
  searchLabel,
}) => {
  const stripes = useStripes();

  const canAddContact = stripes.hasPerm('ui-organizations.privileged-contacts.edit');
  const searchButtonStyle = canAddContact ? searchButtonStyleProp : 'disabled';

  console.log('searchButtonStyle', { searchButtonStyle, canAddContact });

  const renderNewContactBtn = () => {
    const url = `/organizations${orgId ? '/' + orgId : ''}/${PRIVILEGED_CONTACT_URL}/add-contact`;

    return (
      <Button
        marginBottom0
        buttonStyle="primary"
        to={url}
      >
        <FormattedMessage id="stripes-acq-components.privilegedContacts.newContact" />
      </Button>
    );
  };

  return (
    <Pluggable
      aria-haspopup="true"
      type="find-contact"
      dataKey="contact"
      searchLabel={searchLabel}
      searchButtonStyle={searchButtonStyle}
      disableRecordCreation
      stripes={stripes}
      addContacts={onAddContacts}
      renderNewContactBtn={renderNewContactBtn}
      isPrivilegedContactEnabled
    >
      <span data-test-add-contact>
        <FormattedMessage id="stripes-acq-components.privilegedContacts.noFindContactPlugin" />
      </span>
    </Pluggable>
  );
};

PrivilegedDonorContactsLookup.propTypes = {
  onAddContacts: PropTypes.func.isRequired,
  searchLabel: PropTypes.node,
  searchButtonStyle: PropTypes.string,
  orgId: PropTypes.string,
};

PrivilegedDonorContactsLookup.defaultProps = {
  searchLabel: <FormattedMessage id="stripes-acq-components.privilegedContacts.button.addDonor" />,
  searchButtonStyle: 'default',
};
