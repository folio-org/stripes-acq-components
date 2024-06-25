import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';
import { useExpenseClassOptions } from './useExpenseClassOptions';

const ExpenseClassFilter = ({
  activeFilters,
  disabled,
  closedByDefault,
  id,
  labelId,
  name,
  onChange,
  tenantId,
}) => {
  const options = useExpenseClassOptions({ tenantId });

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={id}
      labelId={labelId}
      name={name}
      onChange={onChange}
    >
      <MultiSelectionFilter
        ariaLabelledBy={`accordion-toggle-button-${id}`}
        dataOptions={options}
        disabled={disabled}
        id="expense-class-filter"
        name={name}
        onChange={onChange}
        selectedValues={activeFilters}
      />
    </FilterAccordion>
  );
};

ExpenseClassFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tenantId: PropTypes.string,
};

ExpenseClassFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
  labelId: 'stripes-acq-components.filter.expenseClass',
};

export default ExpenseClassFilter;
