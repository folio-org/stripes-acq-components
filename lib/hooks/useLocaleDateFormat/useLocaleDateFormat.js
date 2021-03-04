import { useMemo } from 'react';
import moment from 'moment';

import { useStripes } from '@folio/stripes/core';

export function useLocaleDateFormat() {
  const stripes = useStripes();
  const localeDateFormat = useMemo(
    () => moment.localeData(stripes.locale).longDateFormat('L'),
    [stripes.locale],
  );

  return localeDateFormat;
}
