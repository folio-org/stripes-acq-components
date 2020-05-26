import React from 'react';
import PropTypes from 'prop-types';

import {
  LoadingPane,
} from '@folio/stripes/components';

const AcqLoadingPane = ({ onClose, ...rest }) => (
  <LoadingPane
    id="pane-loading"
    defaultWidth="fill"
    dismissible
    onClose={onClose}
    {...rest}
  />
);

AcqLoadingPane.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default LoadingPane;
