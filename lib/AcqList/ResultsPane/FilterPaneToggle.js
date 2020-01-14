import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  PaneMenu,
} from '@folio/stripes/components';
import {
  SearchAndSortSearchButton,
} from '@folio/stripes/smart-components';

const FilterPaneToggle = ({ toggleFiltersPane, filters }) => {
  const filterCount = filters && Object.keys(filters).length;

  return (
    <PaneMenu>
      <FormattedMessage
        id="stripes-smart-components.numberOfFilters"
        values={{ count: filterCount }}
      >
        {appliedFiltersMessage => (
          <SearchAndSortSearchButton
            visible={!filters}
            aria-label={appliedFiltersMessage}
            onClick={toggleFiltersPane}
            badge={filterCount}
          />
        )}
      </FormattedMessage>
    </PaneMenu>
  );
};

FilterPaneToggle.propTypes = {
  toggleFiltersPane: PropTypes.func,
  filters: PropTypes.object,
};

export default FilterPaneToggle;
