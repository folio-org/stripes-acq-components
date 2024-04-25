import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const useAffiliationsSelectionOptions = (affiliations) => {
  const intl = useIntl();

  const dataOptions = useMemo(() => (
    affiliations?.map(({ tenantId, tenantName, isPrimary }) => {
      const label = [
        tenantName,
        isPrimary && intl.formatMessage({ id: 'ui-users.affiliations.primary.label' }),
      ]
        .filter(Boolean)
        .join(' ');

      return {
        value: tenantId,
        label,
      };
    })
  ), [affiliations, intl]);

  return {
    dataOptions,
  };
};
