import { EVENT_EMITTER_EVENTS } from '../constants';

export const emitInitialSelectedRecords = (eventEmitter, initialSelected, { locations }) => {
  if (!initialSelected?.length) return;

  const recordsMap = initialSelected.reduce((acc, curr) => {
    const record = locations.find(({ id }) => id === curr.id);

    if (record) {
      acc[curr.id] = record;
    } else {
      /*
      The location may not be found in the `records` because the user lacks an affiliation in any of the tenants
      that corresponds to the initializing location.
     */
      acc[curr.id] = curr;
    }

    return acc;
  }, {});

  eventEmitter.emit(EVENT_EMITTER_EVENTS.INITIALIZE_SELECTED_RECORDS_MAP, recordsMap);
};
