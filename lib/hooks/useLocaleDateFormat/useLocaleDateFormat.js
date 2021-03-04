import { useMemo } from 'react';
import moment from 'moment';

import { useStripes } from '@folio/stripes/core';

export function useLocaleDateFormat() {
  const stripes = useStripes();

  return useMemo(
    () => moment.localeData(stripes.locale).longDateFormat('L'),
    [stripes.locale],
  );
}
