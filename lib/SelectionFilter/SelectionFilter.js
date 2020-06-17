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
      id={id}
      closedByDefault={closedByDefault}
      displayClearButton={activeFilters.length > 0}
      header={FilterAccordionHeader}
      label={<FormattedMessage id={labelId} />}
      onClearFilter={createClearFilterHandler(onChange, name)}
    >
      <Selection
        aria-labelledby={`accordion-toggle-button-${id}`}
        dataOptions={options}
        id={`${name}-selection`}
        onChange={createOnChangeSelectionFilter(onChange, name)}
        onFilter={filterSelectValues}
        value={activeFilters[0] || ''}
      />
    </Accordion>
  );
};

SelectionFilter.propTypes = {
  id: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  labelId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

export default SelectionFilter;
