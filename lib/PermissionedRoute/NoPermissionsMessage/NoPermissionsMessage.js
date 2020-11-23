import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';

const NoPermissionsMessage = ({ returnLinkLabelId, returnLink }) => (
  <MessageBanner type="warning">
    <FormattedMessage id="stripes-acq-components.noPermissionsMessage" />
    <Link to={returnLink}>
      <FormattedMessage id={returnLinkLabelId} />
    </Link>
  </MessageBanner>
);

NoPermissionsMessage.propTypes = {
  returnLink: PropTypes.string.isRequired,
  returnLinkLabelId: PropTypes.string.isRequired,
};

export default NoPermissionsMessage;
