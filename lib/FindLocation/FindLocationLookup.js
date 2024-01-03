import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ColumnManager } from '@folio/stripes/smart-components';

import { EVENT_EMMITER_EVENTS } from '../constants';
import { FindRecords } from '../FindRecords';
import {
  useCampuses,
  useEventEmitter,
  useInstitutions,
  useLibraries,
} from '../hooks';
import {
  NON_TOGGLEABLE_COLUMNS,
  SORTABLE_COLUMNS,
} from './configs';
import { FindLocationFilters } from './FindLocationFilters';
import {
  useLocationsList,
  useLocationsRecords,
} from './hooks';

export const FindLocationLookup = (props) => {
  const {
    filterRecords,
    idPrefix,
    initialSelected,
    isMultiSelect,
    modalLabel,
    onRecordsSelect,
    resultsPaneTitle,
    sortableColumns,
    ...rest
  } = props;

  const eventEmitter = useEventEmitter();

  const [selectedLocations, setSelectedLocations] = useState({});
  const [filters, setFilters] = useState({});

  const { institutions, isLoading: isInstitutionsLoading } = useInstitutions();
  const { campuses, isLoading: isCampusesLoading } = useCampuses();
  const { libraries, isLoading: isLibrariesLoading } = useLibraries();

  const institutionsMap = useMemo(() => keyBy(institutions, 'id'), [institutions]);
  const campusesMap = useMemo(() => keyBy(campuses, 'id'), [campuses]);
  const librariesMap = useMemo(() => keyBy(libraries, 'id'), [libraries]);

  const { locations, isLoading: isLocationsLoading } = useLocationsRecords({
    filters,
    filterRecords,
    selectedLocations,
    initialSelected,
    institutionsMap,
    campusesMap,
    librariesMap,
  });

  /*
    Subscribe on changes in selected records.
  */
  useEffect(() => {
    const callback = ({ detail: assignment }) => setSelectedLocations(assignment);

    eventEmitter.on(EVENT_EMMITER_EVENTS.FIND_RECORDS_SELECTED_CHANGED, callback);

    return () => {
      eventEmitter.off(EVENT_EMMITER_EVENTS.FIND_RECORDS_SELECTED_CHANGED, callback);
    };
  }, [eventEmitter]);

  const {
    columnMapping,
    resultsFormatter,
  } = useLocationsList({
    campusesMap,
    institutionsMap,
    isMultiSelect,
    librariesMap,
    selectedLocations,
  });

  const isLoading = (
    isLocationsLoading
    || isInstitutionsLoading
    || isCampusesLoading
    || isLibrariesLoading
  );

  const renderFilters = useCallback((activeFilters, applyFilters) => (
    <FindLocationFilters
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      disabled={isLoading}
      isMultiSelect={isMultiSelect}
      institutions={institutions}
      campuses={campuses}
      libraries={libraries}
    />
  ), [
    campuses,
    institutions,
    isMultiSelect,
    isLoading,
    libraries,
  ]);

  return (
    <ColumnManager
      id="find-locations"
      columnMapping={columnMapping}
      excludeKeys={NON_TOGGLEABLE_COLUMNS}
    >
      {({ renderColumnsMenu, visibleColumns }) => (
        <FindRecords
          trigerless
          modalLabel={modalLabel}
          resultsPaneTitle={resultsPaneTitle}
          idPrefix={idPrefix}
          visibleColumns={visibleColumns}
          sortableColumns={sortableColumns}
          columnMapping={columnMapping}
          resultsFormatter={resultsFormatter}
          records={locations}
          totalCount={locations.length}
          refreshRecords={setFilters}
          isMultiSelect={isMultiSelect}
          isLoading={isLoading}
          selectRecords={onRecordsSelect}
          stickyFirstColumn={isMultiSelect}
          renderActionMenu={() => renderColumnsMenu}
          renderFilters={renderFilters}
          preventNonSelectedSubmit={false}
          {...rest}
        />
      )}
    </ColumnManager>
  );
};

FindLocationLookup.propTypes = {
  filterRecords: PropTypes.func,
  idPrefix: PropTypes.string,
  initialSelected: PropTypes.arrayOf(PropTypes.string),
  isMultiSelect: PropTypes.bool,
  modalLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onRecordsSelect: PropTypes.func.isRequired,
  resultsPaneTitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

FindLocationLookup.defaultProps = {
  idPrefix: 'FindLocation-',
  initialSelected: [],
  isMultiSelect: false,
  modalLabel: <FormattedMessage id="stripes-acq-components.find-location.modal.label" />,
  resultsPaneTitle: <FormattedMessage id="stripes-acq-components.find-location.results.heading" />,
  sortableColumns: SORTABLE_COLUMNS,
};
