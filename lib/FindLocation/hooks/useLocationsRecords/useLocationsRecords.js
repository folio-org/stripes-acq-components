import flow from 'lodash/flow';
import identity from 'lodash/identity';
import omit from 'lodash/omit';
import {
  useContext,
  useEffect,
  useState,
} from 'react';

import { ConsortiumLocationsContext } from '../../../consortia/contexts';
import { LocationsContext } from '../../../contexts';
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

const filterByTenant = (tenantId) => (locations) => {
  return locations.filter((location) => location.tenantId === tenantId);
};

export const useLocationsRecords = ({
  crossTenant,
  filters,
  filterRecords: customFilter = identity,
  selectedLocations,
  institutionsMap,
  campusesMap,
  librariesMap,
  tenantId,
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [locationRecords, setLocationRecords] = useState([]);

  const { locations, isFetching } = useContext(crossTenant ? ConsortiumLocationsContext : LocationsContext);

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

  const isLoading = isFetching || isProcessing;

  return {
    locations: locationRecords,
    isLoading,
  };
};
