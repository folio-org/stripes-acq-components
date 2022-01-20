import { useState, useCallback, useEffect } from 'react';

const reduceCheckedRecords = (records, isChecked = false) => {
  const recordsReducer = (accumulator, record) => {
    if (isChecked) {
      accumulator[record.id] = record;
    }

    return accumulator;
  };

  return records.reduce(recordsReducer, {});
};

export const useRecordsSelect = ({ records }) => {
  const [allRecordsSelected, setAllRecordsSelected] = useState(false);
  const [selectedRecordsMap, setSelectedRecordsMap] = useState({});
  const selectedRecordsLength = Object.keys(selectedRecordsMap).length;

  useEffect(() => {
    setAllRecordsSelected(records.every(r => Boolean(selectedRecordsMap[r.id])));
  }, [records, selectedRecordsMap]);

  const toggleSelectAll = useCallback(() => {
    setSelectedRecordsMap(() => reduceCheckedRecords(records, !allRecordsSelected));
  }, [allRecordsSelected, records]);

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
