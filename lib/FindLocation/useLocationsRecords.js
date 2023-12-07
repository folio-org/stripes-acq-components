import omit from 'lodash/omit';
import { useEffect, useState } from 'react';

import { useLocations } from '../hooks';
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

export const useLocationsRecords = ({
  filters,
  selectedLocations,
  institutionsMap,
  campusessMap,
  librariesMap,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [locationRecords, setLocationRecords] = useState([]);
  const { locations, isLoading: isLocationsLoading } = useLocations();

  useEffect(() => {
    Promise.resolve(true)
      .then(setIsProcessing)
      .then(() => hydrateLocations(locations, selectedLocations, institutionsMap, campusessMap, librariesMap))
      .then((items) => filterAndSort(FILTERS_CONFIG, filters, items))
      .then(dehydrateLocations)
      .then(setLocationRecords)
      .then(() => setIsProcessing(false));
  }, [
    filters,
    locations,
    selectedLocations,
    institutionsMap,
    campusessMap,
    librariesMap,
  ]);

  const isLoading = isLocationsLoading || isProcessing;

  return {
    locations: locationRecords,
    isLoading,
  }
}
