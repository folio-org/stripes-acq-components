import PropTypes from 'prop-types';

import { MultiSelectionFilter } from '@folio/stripes/smart-components';

import { FilterAccordion } from '../FilterAccordion';

const getFundOptions = (funds = []) => funds.map(fund => ({
  value: fund.id,
  label: fund.code,
}));

const FundFilter = ({
  funds,
  labelId,
  name,
  id,
  disabled,
  activeFilters,
  closedByDefault,
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
          id="acq-tags-filter"
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
  funds: PropTypes.arrayOf(PropTypes.object),
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

FundFilter.defaultProps = {
  labelId: 'stripes-acq-components.filter.fundCode',
};

export default FundFilter;
