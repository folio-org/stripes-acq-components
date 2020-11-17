import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { IfPermission } from '@folio/stripes/core';

import NoPermissionsMessage from './NoPermissionsMessage';

const PermissionedRoute = ({ children, perm, returnLinkLabelId, returnLink, ...rest }) => (
  <Route
    {...rest}
    render={() => (
      <IfPermission perm={perm}>
        {({ hasPermission }) => (hasPermission
          ? children
          : (
            <NoPermissionsMessage
              returnLinkLabelId={returnLinkLabelId}
              returnLink={returnLink}
            />
          )
        )}
      </IfPermission>
    )}
  />
);

PermissionedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  perm: PropTypes.string.isRequired,
  returnLink: PropTypes.string.isRequired,
  returnLinkLabelId: PropTypes.string.isRequired,
};

export default PermissionedRoute;
