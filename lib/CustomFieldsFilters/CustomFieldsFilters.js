import PropTypes from 'prop-types';

import { CUSTOM_FIELDS_FILTER } from '../constants/customFields';
import CustomFieldsFilter from './CustomFieldsFilter';

export const CustomFieldsFilters = ({
  activeFilters,
  customFields,
  onChange,
  ...props
}) => {
  if (!customFields) return null;

  return customFields.map((customField) => (
    <CustomFieldsFilter
      activeFilters={activeFilters[`${CUSTOM_FIELDS_FILTER}.${customField.refId}`]}
      customField={customField}
      key={`custom-field-${customField.id}`}
      onChange={onChange}
      {...props}
    />
  ));
};

CustomFieldsFilters.propTypes = {
  activeFilters: PropTypes.object,
  closedByDefault: PropTypes.bool,
  customFields: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
