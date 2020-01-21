import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';

import {
  createClearFilterHandler,
  createOnChangeSelectionFilter,
  filterSelectValues,
} from '../utils';
import { selectOptionsShape } from '../shapes';

const SelectionFilter = ({
  id,
  activeFilters = [],
  closedByDefault = true,
  labelId,
  name,
  onChange,
  options = [],
}) => {
  return (
    <Accordion
      id={id || name}
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters.length > 0}
      header={FilterAccordionHeader}
      label={<FormattedMessage id={labelId} />}
      onClearFilter={createClearFilterHandler(onChange, name)}
    >
      <Selection
        dataOptions={options}
        onChange={createOnChangeSelectionFilter(onChange, name)}
        onFilter={filterSelectValues}
        value={activeFilters[0] || ''}
      />
    </Accordion>
  );
};

SelectionFilter.propTypes = {
  id: PropTypes.string,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

export default SelectionFilter;
