import identity from 'lodash/identity';
import omit from 'lodash/omit';
import { useEffect, useState } from 'react';

import { EVENT_EMMITER_EVENTS } from '../constants';
import {
  useEventEmitter,
  useLocations,
} from '../hooks';
import { FILTERS_CONFIG } from './configs';
import { filterAndSort } from './filterAndSort';

const hydrateLocations = (
  locations,
  selectedLocations,
  institutionsMap,
  campusessMap,
  librariesMap,
) => {
  return locations.map(location => ({
    ...location,
    isAssigned: Boolean(selectedLocations[location.id]),
    institution: institutionsMap[location.institutionId],
    campus: campusessMap[location.campusId],
    library: librariesMap[location.libraryId],
  }));
};

const dehydrateLocations = (hydratedLocations) => {
  return hydratedLocations.map((location) => omit(location, ['isAssigned']));
};

const emitInitialSelectedRecords = (eventEmitter, initialSelected, records) => {
  if (!initialSelected?.length) return;

  const recordsMap = initialSelected.reduce((acc, curr) => {
    const record = records.find(({ id }) => id === curr);

    if (record) {
      acc[curr] = record;
    }

    return acc;
  }, {});

  eventEmitter.emit(EVENT_EMMITER_EVENTS.INITIALIZE_SELECTED_RECORDS_MAP, recordsMap);
};

export const useLocationsRecords = ({
  filters,
  filterRecords: customFilter = identity,
  selectedLocations,
  initialSelected,
  institutionsMap,
  campusesMap,
  librariesMap,
}) => {
  const eventEmitter = useEventEmitter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [locationRecords, setLocationRecords] = useState([]);
  const { locations, isLoading: isLocationsLoading } = useLocations({
    onSuccess: emitInitialSelectedRecords.bind(null, eventEmitter, initialSelected),
  });

  useEffect(() => {
    setIsProcessing(true);

    const hydrated = hydrateLocations(locations, selectedLocations, institutionsMap, campusesMap, librariesMap);
    const filtered = customFilter(filterAndSort(FILTERS_CONFIG, filters, hydrated));
    const dehydrated = dehydrateLocations(filtered);

    setLocationRecords(dehydrated);
    setIsProcessing(false);
  }, [
    customFilter,
    filters,
    locations,
    selectedLocations,
    institutionsMap,
    campusesMap,
    librariesMap,
  ]);

  const isLoading = isLocationsLoading || isProcessing;

  return {
    locations: locationRecords,
    isLoading,
  };
};
