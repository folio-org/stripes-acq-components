import flow from 'lodash/flow';
import identity from 'lodash/identity';
import omit from 'lodash/omit';
import { useEffect, useState } from 'react';

import { EVENT_EMMITER_EVENTS } from '../../../constants';
import {
  useConsortiumLocations,
  useEventEmitter,
  useLocations,
} from '../../../hooks';
import { FILTERS_CONFIG } from '../../configs';
import { filterAndSort } from '../../filterAndSort';

const hydrateLocations = (
  locations,
  selectedLocations,
  institutionsMap,
  campusesMap,
  librariesMap,
) => {
  return locations.map(location => ({
    ...location,
    isAssigned: Boolean(selectedLocations[location.id]),
    institution: institutionsMap[location.institutionId],
    campus: campusesMap[location.campusId],
    library: librariesMap[location.libraryId],
  }));
};

const dehydrateLocations = (hydratedLocations) => {
  return hydratedLocations.map((location) => omit(location, ['isAssigned']));
};

const emitInitialSelectedRecords = (eventEmitter, initialSelected, { locations }) => {
  if (!initialSelected?.length) return;

  const recordsMap = initialSelected.reduce((acc, curr) => {
    const record = locations.find(({ id }) => id === curr.locationId);

    if (record) {
      acc[curr.locationId] = record;
    } else {
      /*
      The location may not be found in the `records` because the user lacks an affiliation in any of the tenants
      that corresponds to the initializing location.
     */
      acc[curr.locationId] = curr;
    }

    return acc;
  }, {});

  eventEmitter.emit(EVENT_EMMITER_EVENTS.INITIALIZE_SELECTED_RECORDS_MAP, recordsMap);
};

const filterByTenant = (tenantId) => (locations) => {
  return locations.filter((location) => location.tenantId === tenantId);
};

export const useLocationsRecords = ({
  crossTenant,
  filters,
  filterRecords: customFilter = identity,
  selectedLocations,
  initialSelected,
  institutionsMap,
  campusesMap,
  librariesMap,
  tenantId,
}) => {
  const eventEmitter = useEventEmitter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [locationRecords, setLocationRecords] = useState([]);

  console.log(isProcessing);

  const { isLoading: isLocationsLoading, locations } = (crossTenant ? useConsortiumLocations : useLocations)({
    onSuccess: emitInitialSelectedRecords.bind(null, eventEmitter, initialSelected),
  });

  useEffect(() => {
    setIsProcessing(true);

    const hydrated = hydrateLocations(locations, selectedLocations, institutionsMap, campusesMap, librariesMap);
    const filtered = flow(
      crossTenant ? filterByTenant(tenantId) : identity,
      filterAndSort.bind(null, FILTERS_CONFIG, filters),
      customFilter,
    )(hydrated);
    const dehydrated = dehydrateLocations(filtered);

    setLocationRecords(dehydrated);
    setIsProcessing(false);
  }, [
    campusesMap,
    crossTenant,
    customFilter,
    filters,
    institutionsMap,
    librariesMap,
    locations,
    selectedLocations,
    tenantId,
  ]);

  const isLoading = isLocationsLoading || isProcessing;

  return {
    locations: locationRecords,
    isLoading,
  };
};
