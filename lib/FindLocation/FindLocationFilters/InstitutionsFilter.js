import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../../FilterAccordion';

export const InstitutionsFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  id,
  labelId,
  name,
  onChange,
  options,
}) => {
  return (
    <FilterAccordion
      id={id}
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <MultiSelectionFilter
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={options}
        disabled={disabled}
        id="institutions-filter"
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </FilterAccordion>
  );
};

InstitutionsFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
};

InstitutionsFilter.defaultProps = {
  closedByDefault: false,
  disabled: false,
  labelId: 'stripes-acq-components.filter.institution',
};
