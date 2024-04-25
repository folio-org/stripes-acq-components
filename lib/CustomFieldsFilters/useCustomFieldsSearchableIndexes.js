import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { CUSTOM_FIELDS_FILTER, CUSTOM_FIELDS_TYPES } from '../constants/customFields';
import { useLocaleDateFormat } from '../hooks/useLocaleDateFormat';

export const useCustomFieldsSearchableIndexes = (customFields) => {
  const intl = useIntl();
  const localeDateFormat = useLocaleDateFormat();
  const customFieldLabel = intl.formatMessage({ id: 'stripes-smart-components.customFields' });

  return useMemo(() => {
    let result = [];

    if (customFields) {
      result = customFields.map(cf => {
        const fieldLabel = `${customFieldLabel} ${cf.name}`;
        const fieldValue = `${CUSTOM_FIELDS_FILTER}.${cf.refId}`;

        if (cf.type === CUSTOM_FIELDS_TYPES.TEXTBOX_LONG || cf.type === CUSTOM_FIELDS_TYPES.TEXTBOX_SHORT) {
          return {
            label: fieldLabel,
            value: fieldValue,
          };
        } else if (cf.type === CUSTOM_FIELDS_TYPES.DATE_PICKER) {
          return {
            label: fieldLabel,
            value: fieldValue,
            placeholder: localeDateFormat,
          };
        } else {
          return null;
        }
      }).filter(obj => obj !== null);
    }

    return result;
  }, [customFields, localeDateFormat, customFieldLabel]);
};
