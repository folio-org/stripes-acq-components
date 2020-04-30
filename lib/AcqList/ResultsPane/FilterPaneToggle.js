import React from 'react';
import PropTypes from 'prop-types';

import {
  PaneMenu,
} from '@folio/stripes/components';
import {
  ExpandFilterPaneButton,
} from '@folio/stripes/smart-components';

import { getFilterParams } from '../utils';

const FilterPaneToggle = ({ toggleFiltersPane, filters }) => {
  const filterCount = filters && Object.keys(getFilterParams(filters)).filter(k => filters[k] !== undefined).length;

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
