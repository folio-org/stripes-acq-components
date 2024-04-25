import { buildArrayFieldQuery, buildDateRangeQuery } from '../AcqList';
import {
  CUSTOM_FIELDS_FILTER,
  CUSTOM_FIELDS_TYPES,
} from '../constants/customFields';

export const getCustomFieldsFilterMap = (customFields) => {
  const result = {};

  if (customFields) {
    customFields.forEach((cf) => {
      const fieldName = `${CUSTOM_FIELDS_FILTER}.${cf.refId}`;

      if (cf.type === CUSTOM_FIELDS_TYPES.MULTI_SELECT_DROPDOWN) {
        result[fieldName] = buildArrayFieldQuery.bind(null, fieldName);
      } else if (cf.type === CUSTOM_FIELDS_TYPES.DATE_PICKER) {
        result[fieldName] = buildDateRangeQuery.bind(null, fieldName);
      }
    });
  }

  return result;
};

export const getCustomFieldsKeywordIndexes = (customFields) => {
  return (customFields || [])
    .filter((cf) => [
      CUSTOM_FIELDS_TYPES.DATE_PICKER,
      CUSTOM_FIELDS_TYPES.TEXTBOX_SHORT,
      CUSTOM_FIELDS_TYPES.TEXTBOX_LONG,
    ].includes(cf.type))
    .map((cf) => `${CUSTOM_FIELDS_FILTER}.${cf.refId}`);
};
