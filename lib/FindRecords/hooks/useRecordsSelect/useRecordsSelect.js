import differenceBy from 'lodash/differenceBy';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import {
  useState,
  useCallback,
  useEffect,
} from 'react';

import { EVENT_EMITTER_EVENTS } from '../../../constants';
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

  const emitChangeEvent = useCallback((recordsMap) => {
    eventEmitter.emit(
      EVENT_EMITTER_EVENTS.FIND_RECORDS_SELECTED_CHANGED,
      recordsMap,
    );
  }, [eventEmitter]);

  /*
    Subscribe to event for initialize selected records.
  */
  useEffect(() => {
    const eventType = EVENT_EMITTER_EVENTS.INITIALIZE_SELECTED_RECORDS_MAP;
    const callback = ({ detail: recordsMap }) => {
      emitChangeEvent(recordsMap);
      setSelectedRecordsMap(recordsMap);
    };

    eventEmitter.on(eventType, callback);

    return () => {
      eventEmitter.off(eventType, callback);
    };
  }, [emitChangeEvent, eventEmitter]);

  useEffect(() => {
    setAllRecordsSelected(Boolean(records?.length) && records.every(r => Boolean(selectedRecordsMap[r.id])));
  }, [records, selectedRecordsMap]);

  const toggleSelectAll = useCallback(() => {
    setSelectedRecordsMap(() => {
      const newMap = {
        ...selectedFromOtherPages(selectedRecordsMap, records),
        ...reduceCheckedRecords(records, !allRecordsSelected),
      };

      emitChangeEvent(newMap);

      return newMap;
    });
  }, [allRecordsSelected, emitChangeEvent, records, selectedRecordsMap]);

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

      emitChangeEvent(newMap);

      return newMap;
    });
  }, [emitChangeEvent]);

  const isRecordSelected = useCallback(
    ({ item }) => Boolean(selectedRecordsMap[item.id]),
    [selectedRecordsMap],
  );

  /*
   * Clear all selected records.
   */
  const resetAllSelectedRecords = useCallback(() => {
    setSelectedRecordsMap({});
    emitChangeEvent({});
  }, [emitChangeEvent]);

  /*
   * Clear selected records with provided ids.
   */
  const resetSelectedRecordsByIds = useCallback((ids) => {
    setSelectedRecordsMap(prevMap => {
      const newMap = omit(prevMap, ids);

      emitChangeEvent(newMap);

      return newMap;
    });
  }, [emitChangeEvent]);

  /*
   * Clear selected records except the ones with provided ids.
   */
  const resetOtherSelectedRecordsByIds = useCallback((ids) => {
    setSelectedRecordsMap(prevMap => {
      const newMap = pick(prevMap, ids);

      emitChangeEvent(newMap);

      return newMap;
    });
  }, [emitChangeEvent]);

  return {
    allRecordsSelected,
    isRecordSelected,
    resetAllSelectedRecords,
    resetOtherSelectedRecordsByIds,
    resetSelectedRecordsByIds,
    selectedRecordsLength,
    selectedRecordsMap,
    selectRecord,
    toggleSelectAll,
  };
};
