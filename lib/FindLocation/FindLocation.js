import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ColumnManager } from '@folio/stripes/smart-components';

import { EVENT_EMMITER_EVENTS } from '../constants';4
import { FindRecords } from '../FindRecords';
import { useEventEmitter } from '../hooks';
import {
  COLUMN_MAPPING,
  COLUMN_NAMES,
  NON_TOGGLEABLE_COLUMNS,
  SORTABLE_COLUMNS,
} from './configs'
import { FindLocationFilters } from './FindLocationFilters';
import { useLocationsRecords } from './useLocationsRecords';

export const FindLocation = (props) => {
  const {
    idPrefix,
    isMultiSelect,
    modalLabel,
    onRecordsSelect,
    resultsPaneTitle,
    sortableColumns,
    ...rest
  } = props;

  const eventEmitter = useEventEmitter();

  const [selectedLocations, setSelectedLocations] = useState({});

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
    )
  }), [isMultiSelect]);

  const resultsFormatter = useMemo(() => ({
    [COLUMN_NAMES.name]: ({ name }) => name,
    // TODO: add formatters for the rest of colls
    [COLUMN_NAMES.code]: ({ code }) => code,
    [COLUMN_NAMES.isActive]: ({ isActive }) => (
      <FormattedMessage id={`stripes-acq-components.find-location.results.column.status.${ isActive ? 'active': 'inactive'}`} />
    ),
    [COLUMN_NAMES.isAssigned]: ({ id }) => (
      <FormattedMessage id={`stripes-acq-components.filter.assignment.${ selectedLocations[id] ? 'assigned': 'unassigned'}`} />
    ),
  }), [selectedLocations]);

  const { locations, isLoading } = useLocationsRecords();

  const renderFilters = useCallback((activeFilters, applyFilters) => (
    <FindLocationFilters
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      isMultiSelect={isMultiSelect}
    />
  ), [isMultiSelect]);

  const refreshRecords = useCallback((data) => {
    console.log('refresh', data)
  }, []);

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
          refreshRecords={refreshRecords}
          isMultiSelect={isMultiSelect}
          isLoading={isLoading}
          selectRecords={onRecordsSelect}
          stickyFirstColumn={isMultiSelect}
          renderActionMenu={() => renderColumnsMenu}
          renderFilters={renderFilters}
          {...rest}
        />
      )}
    </ColumnManager>
  );
};

FindLocation.propTypes = {
  idPrefix: PropTypes.string,
  isMultiSelect: PropTypes.bool,
  modalLabel: PropTypes.oneOf([PropTypes.element, PropTypes.string]),
  onRecordsSelect: PropTypes.func.isRequired,
  resultsPaneTitle: PropTypes.oneOf([PropTypes.element, PropTypes.string]),
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

FindLocation.defaultProps = {
  idPrefix: 'FindLocation-',
  isMultiSelect: false,
  modalLabel: <FormattedMessage id="stripes-acq-components.find-location.modal.label" />,
  resultsPaneTitle: <FormattedMessage id="stripes-acq-components.find-location.results.heading" />,
  sortableColumns: SORTABLE_COLUMNS,
};
