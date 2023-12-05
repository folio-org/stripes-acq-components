import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { VENDOR_DEFAULT_CATEGORIES } from '../constants';

export const useTranslatedCategories = (categories) => {
  const intl = useIntl();

  const translatedCategories = useMemo(() => (
    categories?.map(category => {
      const translationKey = VENDOR_DEFAULT_CATEGORIES[category.value];
      const categoryValue = translationKey
        ? intl.formatMessage({
          id: `ui-organizations.contactInfo.vendorCategory.${translationKey}`,
          defaultMessage: category.value,
        })
        : category.value;

      return ({
        ...category,
        value: categoryValue,
      });
    })),
  [categories, intl]);

  return [translatedCategories];
};
