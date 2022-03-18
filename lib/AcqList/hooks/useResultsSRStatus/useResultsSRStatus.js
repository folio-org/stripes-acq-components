import {
  useRef,
  useEffect,
} from 'react';
import {
  useIntl,
} from 'react-intl';

export const useResultsSRStatus = ({ hasFilters, resultsCount }) => {
  const intl = useIntl();
  const readerStatusRef = useRef();

  useEffect(() => {
    const message = hasFilters
      ? intl.formatMessage({ id: 'stripes-acq-components.resultsCount' }, { resultsCount })
      : intl.formatMessage({ id: 'stripes-smart-components.sas.noResults.noTerms' });

    readerStatusRef.current?.sendMessage(message);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFilters, resultsCount]);

  return {
    readerStatusRef,
  };
};
