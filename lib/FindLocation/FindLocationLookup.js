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
  COLUMN_MAPPING,
  COLUMN_NAMES,
  NON_TOGGLEABLE_COLUMNS,
  SORTABLE_COLUMNS,
} from './configs';
import { FindLocationFilters } from './FindLocationFilters';
import { useLocationsRecords } from './useLocationsRecords';

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
  const campusessMap = useMemo(() => keyBy(campuses, 'id'), [campuses]);
  const librariesMap = useMemo(() => keyBy(libraries, 'id'), [libraries]);

  const { locations, isLoading: isLocationsLoading } = useLocationsRecords({
    filters,
    filterRecords,
    selectedLocations,
    initialSelected,
    institutionsMap,
    campusessMap,
    librariesMap,
  });

  /*
    Subscribe on changes in selected records.
  */
  useEffect(() => {
    const eventType = EVENT_EMMITER_EVENTS.FIND_RECORDS_SELECTED_CHANGED;
    const callback = ({ detail: assignment }) => setSelectedLocations(assignment);

    eventEmitter.on(eventType, callback);

    return () => {
      eventEmitter.off(eventType, callback);
    };
  }, [eventEmitter]);

  const columnMapping = useMemo(() => ({
    ...COLUMN_MAPPING,
    ...(
      isMultiSelect
        ? { [COLUMN_NAMES.isAssigned]: <FormattedMessage id="stripes-acq-components.find-location.results.column.assignment" /> }
        : {}
    ),
  }), [isMultiSelect]);

  const resultsFormatter = useMemo(() => ({
    [COLUMN_NAMES.name]: ({ name }) => name,
    [COLUMN_NAMES.code]: ({ code }) => code,
    [COLUMN_NAMES.institution]: ({ institutionId }) => institutionsMap[institutionId]?.name,
    [COLUMN_NAMES.campus]: ({ campusId }) => campusessMap[campusId]?.name,
    [COLUMN_NAMES.library]: ({ libraryId }) => librariesMap[libraryId]?.name,
    [COLUMN_NAMES.isActive]: (record) => (
      <FormattedMessage id={`stripes-acq-components.find-location.results.column.status.${record.isActive ? 'active' : 'inactive'}`} />
    ),
    [COLUMN_NAMES.isAssigned]: (record) => (
      <FormattedMessage id={`stripes-acq-components.filter.assignment.${selectedLocations[record.id] ? 'assigned' : 'unassigned'}`} />
    ),
  }), [
    campusessMap,
    institutionsMap,
    librariesMap,
    selectedLocations,
  ]);

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
