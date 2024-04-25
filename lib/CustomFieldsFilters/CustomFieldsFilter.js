import PropTypes from 'prop-types';
import { memo } from 'react';
import { useIntl } from 'react-intl';

import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

import { AcqDateRangeFilter } from '../AcqDateRangeFilter';
import { CUSTOM_FIELDS_FILTER } from '../constants/customFields';
import { FilterAccordion } from '../FilterAccordion';

// Map custom field types to specific filters
const customFieldTypeToFilterMap = {
  DATE_PICKER: AcqDateRangeFilter,
  MULTI_SELECT_DROPDOWN: MultiSelectionFilter,
  RADIO_BUTTON: CheckboxFilter,
  SINGLE_CHECKBOX: CheckboxFilter,
  SINGLE_SELECT_DROPDOWN: MultiSelectionFilter,
};

const CustomFieldsFilter = ({
  activeFilters,
  closedByDefault,
  customField,
  disabled,
  onChange,
}) => {
  const FilterComponent = customFieldTypeToFilterMap[customField.type];
  const { refId, name, selectField } = customField;
  const values = selectField?.options?.values ?? [{ id: 'true', value: name }];
  const filterName = `${CUSTOM_FIELDS_FILTER}.${refId}`;
  const dataOptions = values.map(({ id: value, value: label }) => ({
    label,
    value,
  }));

  const intl = useIntl();

  const customFieldLabel = intl.formatMessage({ id: 'stripes-smart-components.customFields' });
  const fieldLabel = `${customFieldLabel} ${name}`;

  if (!FilterComponent) {
    return null;
  }

  if (FilterComponent === AcqDateRangeFilter) {
    return (
      <AcqDateRangeFilter
        activeFilters={activeFilters}
        disabled={disabled}
        id={filterName}
        labelId={fieldLabel}
        name={filterName}
        onChange={onChange}
      />
    );
  }

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={filterName}
      labelId={fieldLabel}
      name={filterName}
      onChange={onChange}
    >
      <FilterComponent
        dataOptions={dataOptions}
        disabled={disabled}
        name={filterName}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </FilterAccordion>
  );
};

CustomFieldsFilter.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  closedByDefault: PropTypes.bool,
  customField: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

CustomFieldsFilter.defaultProps = {
  closedByDefault: true,
  disabled: false,
};

export default memo(CustomFieldsFilter);
