import PropTypes from 'prop-types';

import { FilterGroups } from '@folio/stripes/components';

const DEFAULT_ACTIVE_FILTERS = {};

const Filters = ({
  activeFilters = DEFAULT_ACTIVE_FILTERS,
  config,
  onChangeHandlers: { checkbox, clearGroup },
}) => {
  const groupFilters = {};

  activeFilters.string.split(',').forEach(m => { groupFilters[m] = true; });

  return (
    <FilterGroups
      config={config}
      filters={groupFilters}
      onChangeFilter={checkbox}
      onClearFilter={clearGroup}
    />
  );
};

Filters.propTypes = {
  activeFilters: PropTypes.object,
  config: PropTypes.arrayOf(PropTypes.object),
  onChangeHandlers: PropTypes.object.isRequired,
};

export default Filters;
