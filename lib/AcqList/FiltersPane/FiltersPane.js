import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
} from '@folio/stripes/components';

const paneTitle = <FormattedMessage id="stripes-acq-components.searchAndFilter" />;

const FiltersPane = ({ children, width }) => {
  return (
    <Pane
      defaultWidth={width}
      paneTitle={paneTitle}
    >
      {children}
    </Pane>
  );
};

FiltersPane.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
};

FiltersPane.defaultProps = {
  width: '320px',
};

export default FiltersPane;
