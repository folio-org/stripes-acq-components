import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { FindRecords } from '../FindRecords';
import {
  COLUMN_MAPPING,
  COLUMN_NAMES,
  SORTABLE_COLUMNS,
  VISIBLE_COLUMNS,
} from './configs'
import { useLocationsRecords } from './useLocationsRecords';
import { FindLocationFilters } from './FindLocationFilters';

export const FindLocation = (props) => {
  const {
    columnMapping,
    idPrefix,
    isMultiSelect,
    modalLabel,
    resultsPaneTitle,
    sortableColumns,
    visibleColumns,
    ...rest
  } = props;

  const [selectedLocations, setSelectedLocations] = useState();

  const resultsFormatter = useMemo(() => ({
    [COLUMN_NAMES.name]: ({ name }) => name,
    // TODO: refine
    [COLUMN_NAMES.code]: ({ code }) => code,
    [COLUMN_NAMES.isActive]: ({ isActive }) => (
      <FormattedMessage id={`stripes-acq-components.find-location.results.column.status.${ isActive ? 'active': 'inactive'}`} />
    ),
    [COLUMN_NAMES.isAssigned]: ({ id }) => id,
  }), []);

  const { locations, isLoading } = useLocationsRecords();

  const renderFilters = useCallback((activeFilters, applyFilters) => (
    <FindLocationFilters
      activeFilters={activeFilters}
      applyFilters={applyFilters}
    />
  ), []);

  return (
    <FindRecords
      modalLabel={modalLabel}
      resultsPaneTitle={resultsPaneTitle}
      idPrefix={idPrefix}
      visibleColumns={visibleColumns}
      sortableColumns={sortableColumns}
      columnMapping={columnMapping}
      resultsFormatter={resultsFormatter}
      records={locations}
      totalCount={0}
      refreshRecords={console.log}
      isMultiSelect={isMultiSelect}
      isLoading={isLoading}
      selectRecords={console.log}
      onSelectedChange={setSelectedLocations}
      stickyFirstColumn
      renderFilters={renderFilters}
      {...rest}
    />
  );
};

FindLocation.propTypes = {

};

FindLocation.defaultProps = {
  columnMapping: COLUMN_MAPPING,
  idPrefix: 'FindLocation-',
  isMultiSelect: false,
  modalLabel: <FormattedMessage id="stripes-acq-components.find-location.modal.label" />,
  resultsPaneTitle: <FormattedMessage id="stripes-acq-components.find-location.results.heading" />,
  sortableColumns: SORTABLE_COLUMNS,
  visibleColumns: VISIBLE_COLUMNS,
};
