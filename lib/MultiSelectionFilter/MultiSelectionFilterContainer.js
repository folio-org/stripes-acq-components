import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import { selectOptionsShape } from '../shapes';

const MultiSelectionFilterContainer = ({
  activeFilters,
  closedByDefault,
  disabled,
  id,
  name,
  label,
  labelId,
  onChange,
  options,
}) => (
  <FilterAccordion
    activeFilters={activeFilters}
    closedByDefault={closedByDefault}
    disabled={disabled}
    id={id}
    label={label}
    labelId={labelId}
    name={name}
    onChange={onChange}
  >
    <MultiSelectionFilter
      ariaLabelledBy={`accordion-toggle-button-${id}`}
      dataOptions={options}
      disabled={disabled}
      id={`${name}-filter`}
      name={name}
      onChange={onChange}
      selectedValues={activeFilters}
    />
  </FilterAccordion>
);

MultiSelectionFilterContainer.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: selectOptionsShape,
};

MultiSelectionFilterContainer.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default MultiSelectionFilterContainer;
