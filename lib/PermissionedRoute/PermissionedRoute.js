import React from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import NoPermissionsMessage from './NoPermissionsMessage';

const PermissionedRoute = ({ children, perm, returnLinkLabelId, returnLink, ...rest }) => {
  const stripes = useStripes();

  return (
    <Route
      {...rest}
      render={() => (
        stripes.hasPerm(perm)
          ? children
          : (
            <NoPermissionsMessage
              returnLinkLabelId={returnLinkLabelId}
              returnLink={returnLink}
            />
          )
      )}
    />
  );
};

PermissionedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  perm: PropTypes.string.isRequired,
  returnLink: PropTypes.string.isRequired,
  returnLinkLabelId: PropTypes.string.isRequired,
};

export default PermissionedRoute;
