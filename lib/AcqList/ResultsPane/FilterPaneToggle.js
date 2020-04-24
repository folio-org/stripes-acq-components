import React from 'react';
import PropTypes from 'prop-types';

import {
  PaneMenu,
} from '@folio/stripes/components';
import {
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';

const FilterPaneToggle = ({ toggleFiltersPane, filters }) => {
  const filterCount = filters && Object.keys(filters).length;

  return (
    <PaneMenu>
      <ExpandFilterPaneButton
        filterCount={filterCount}
        onClick={toggleFiltersPane}
      />
    </PaneMenu>
  );
};

FilterPaneToggle.propTypes = {
  toggleFiltersPane: PropTypes.func,
  filters: PropTypes.object,
};

export default FilterPaneToggle;
