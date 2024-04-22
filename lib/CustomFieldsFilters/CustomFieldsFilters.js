import PropTypes from 'prop-types';

import { CUSTOM_FIELDS } from '../constants';
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
      activeFilters={activeFilters[`${CUSTOM_FIELDS}.${customField.refId}`]}
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
