import {
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

import { getFiltersCount } from '../utils';

const useList = (isLoadingRightAway, queryLoadRecords, loadRecordsCB, resultCountIncrement) => {
  const location = useLocation();
  const [records, setRecords] = useState([]);
  const [recordsCount, setRecordsCount] = useState(0);
  const [recordsOffset, setRecordsOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const resultsPaneTitleRef = useRef();

  const loadRecords = useCallback(offset => {
    const queryParams = queryString.parse(location.search);
    const filtersCount = getFiltersCount(queryParams);
    const hasToCallAPI = isLoadingRightAway || filtersCount > 0;

    if (!hasToCallAPI) {
      return Promise.resolve();
    }

    setIsLoading(true);

    return queryLoadRecords(offset, hasToCallAPI).then(recordsResponse => {
      if (!offset) {
        setRecordsCount(recordsResponse?.totalRecords);

        if (recordsResponse?.totalRecords != null) {
          resultsPaneTitleRef?.current?.focus();
        }
      }

      return recordsResponse && loadRecordsCB(setRecords, recordsResponse);
    }).finally(() => setIsLoading(false));
  }, [isLoadingRightAway, loadRecordsCB, location.search, queryLoadRecords]);

  const onNeedMoreData = () => {
    const newOffset = recordsOffset + resultCountIncrement;

    loadRecords(newOffset)
      .then(() => {
        setRecordsOffset(newOffset);
      });
  };

  const refreshList = useCallback(() => {
    setRecords([]);
    setRecordsOffset(0);
    loadRecords(0);
  }, [loadRecords]);

  useEffect(
    () => {
      refreshList();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  return {
    records,
    recordsCount,
    isLoading,
    onNeedMoreData,
    refreshList,
    resultsPaneTitleRef,
  };
};

export default useList;
