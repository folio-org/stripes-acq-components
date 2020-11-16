import React from 'react';
import PropTypes from 'prop-types';

import { IfPermission } from '@folio/stripes/core';

import NoPermissionsMessage from './NoPermissionsMessage';

const CheckPermission = ({ children, perm, labelId, modulePath }) => (
  <IfPermission perm={perm}>
    {({ hasPermission }) => (hasPermission
      ? children
      : <NoPermissionsMessage labelId={labelId} modulePath={modulePath} />
    )}
  </IfPermission>
);

CheckPermission.propTypes = {
  children: PropTypes.node.isRequired,
  labelId: PropTypes.string.isRequired,
  modulePath: PropTypes.string.isRequired,
  perm: PropTypes.string.isRequired,
};

export default CheckPermission;
