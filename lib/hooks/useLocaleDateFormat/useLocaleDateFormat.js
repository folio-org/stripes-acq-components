import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { getLocalFormat } from '@folio/stripes/components';

export function useLocaleDateFormat() {
  const intl = useIntl();

  return useMemo(
    () => getLocalFormat({ intl }),
    [intl],
  );
}
