import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneMenu,
} from '@folio/stripes/components';
import {
  CollapseFilterPaneButton,
} from '@folio/stripes/smart-components';

const paneTitle = <FormattedMessage id="stripes-acq-components.searchAndFilter" />;

const FiltersPane = ({ children, toggleFilters, width }) => {
  const lastMenu = (
    <PaneMenu>
      <CollapseFilterPaneButton onClick={toggleFilters} />
    </PaneMenu>
  );

  return (
    <Pane
      data-test-filter-pane
      defaultWidth={width}
      paneTitle={paneTitle}
      lastMenu={lastMenu}
    >
      {children}
    </Pane>
  );
};

FiltersPane.propTypes = {
  children: PropTypes.node.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  width: PropTypes.string,
};

FiltersPane.defaultProps = {
  width: '320px',
};

export default FiltersPane;
