import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';

const getFundOptions = (funds = []) => funds.map(fund => ({
  label: fund.code,
  value: fund.id,
}));

const FundFilter = ({
  activeFilters,
  closedByDefault,
  disabled,
  funds,
  id,
  labelId = 'stripes-acq-components.filter.fundCode',
  name,
  onChange,
  ...rest
}) => {
  const dataOptions = getFundOptions(funds);

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
      {!dataOptions ? '' : (
        <MultiSelectionFilter
          ariaLabelledBy={`accordion-toggle-button-${id}`}
          dataOptions={dataOptions}
          disabled={disabled}
          id="fund-filter"
          name={name}
          onChange={onChange}
          selectedValues={activeFilters}
          {...rest}
        />
      )}
    </FilterAccordion>
  );
};

FundFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  funds: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FundFilter;
