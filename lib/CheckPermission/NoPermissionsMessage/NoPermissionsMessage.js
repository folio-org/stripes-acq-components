import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { MessageBanner } from '@folio/stripes/components';

const NoPermissionsMessage = ({ labelId, modulePath }) => (
  <MessageBanner type="warning">
    <FormattedMessage id="stripes-acq-components.noPermissionsMessage" />
    <Link to={modulePath}>
      <FormattedMessage id={labelId} />
    </Link>
  </MessageBanner>
);

NoPermissionsMessage.propTypes = {
  labelId: PropTypes.string.isRequired,
  modulePath: PropTypes.string.isRequired,
};

export default NoPermissionsMessage;
