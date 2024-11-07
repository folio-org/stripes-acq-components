import PropTypes from 'prop-types';

import { CUSTOM_FIELDS_FILTER } from '../constants';
import CustomFieldsFilter from './CustomFieldsFilter';

export const CustomFieldsFilters = ({
  activeFilters,
  customFields,
  onChange,
  name,
  ...props
}) => {
  if (!customFields) return null;

  return customFields.map((customField) => (
    <CustomFieldsFilter
      name={name}
      activeFilters={activeFilters[`${name || CUSTOM_FIELDS_FILTER}.${customField.refId}`]}
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
  name: PropTypes.string,
};
