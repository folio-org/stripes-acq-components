import {
  useRef,
  useEffect,
} from 'react';
import {
  useIntl,
} from 'react-intl';

export const useResultsSRStatus = ({ isLoading, hasFilters, resultsCount = 0 }) => {
  const intl = useIntl();
  const readerStatusRef = useRef();

  useEffect(() => {
    if (!isLoading) {
      const message = hasFilters
        ? intl.formatMessage({ id: 'stripes-acq-components.resultsCount' }, { resultsCount })
        : intl.formatMessage({ id: 'stripes-smart-components.sas.noResults.noTerms' });

      readerStatusRef.current?.sendMessage(message);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, hasFilters, resultsCount]);

  return {
    readerStatusRef,
  };
};
