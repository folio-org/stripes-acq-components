import { useIntl } from 'react-intl';
import { invert } from 'lodash';

import { ACQUISITION_METHOD } from '../../constants/order';

const acqMethodMap = invert(ACQUISITION_METHOD);

export const getAcqMethodLabel = (record, { intl, withDeprecatedSuffix = false } = {}) => {
  const { value, deprecated } = record;
  const translationKey = acqMethodMap[value];
  const baseLabel = translationKey
    ? intl.formatMessage({
      id: `stripes-acq-components.acquisition_method.${translationKey}`,
      defaultMessage: value,
    })
    : value;

  if (withDeprecatedSuffix && deprecated) {
    return intl.formatMessage(
      { id: 'stripes-acq-components.acquisition_method.deprecatedSuffix', defaultMessage: '{name} (deprecated)' },
      { name: baseLabel },
    );
  }

  return baseLabel;
};

export const useAcqMethodsOptions = (records = [], {
  excludeDeprecated = false,
  selectedValue,
  withDeprecatedSuffix = false,
} = {}) => {
  const intl = useIntl();

  return records
    .filter(({ id, deprecated }) => !excludeDeprecated || !deprecated || id === selectedValue)
    .map((record) => ({
      label: getAcqMethodLabel(record, { intl, withDeprecatedSuffix }),
      value: record.id,
    }));
};
