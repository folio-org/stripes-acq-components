import { useState, useCallback, useEffect } from 'react';
import { differenceBy, keyBy } from 'lodash';

import { EVENT_EMMITER_EVENTS } from '../../../constants';
import { useEventEmitter } from '../../../hooks';

const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};

const selectedFromOtherPages = (selectedRecordsMap, pageRecords) => {
  const selectedRecords = Object.values(selectedRecordsMap);

  const fromOtherPages = differenceBy(selectedRecords, pageRecords, 'id');

  return keyBy(fromOtherPages, 'id');
};

export const useRecordsSelect = ({ records }) => {
  const eventEmitter = useEventEmitter();
  const [allRecordsSelected, setAllRecordsSelected] = useState(false);
  const [selectedRecordsMap, setSelectedRecordsMap] = useState({});
  const selectedRecordsLength = Object.keys(selectedRecordsMap).length;

  useEffect(() => {
    setAllRecordsSelected(records.every(r => Boolean(selectedRecordsMap[r.id])));
  }, [records, selectedRecordsMap]);

  const toggleSelectAll = useCallback(() => {
    setSelectedRecordsMap(() => {
      const newMap = {
        ...selectedFromOtherPages(selectedRecordsMap, records),
        ...reduceCheckedRecords(records, !allRecordsSelected),
      }

      eventEmitter.emit(
        EVENT_EMMITER_EVENTS.FIND_RECORDS_SELECTED_CHANGED,
        newMap,
      );

      return newMap;
    });
  }, [allRecordsSelected, records, selectedRecordsMap]);

  const selectRecord = useCallback(record => {
    const { id } = record;

    setSelectedRecordsMap(prevMap => {
      const wasChecked = Boolean(prevMap[id]);
      const newMap = { ...prevMap };

      if (wasChecked) {
        delete newMap[id];
      } else {
        newMap[id] = record;
      }

      eventEmitter.emit(
        EVENT_EMMITER_EVENTS.FIND_RECORDS_SELECTED_CHANGED,
        newMap,
      );

      return newMap;
    });
  }, []);

  const isRecordSelected = useCallback(
    ({ item }) => Boolean(selectedRecordsMap[item.id]),
    [selectedRecordsMap],
  );

  return {
    allRecordsSelected,
    selectedRecordsMap,
    selectedRecordsLength,
    toggleSelectAll,
    selectRecord,
    isRecordSelected,
  };
};
