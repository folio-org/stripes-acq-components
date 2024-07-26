import keyBy from 'lodash/keyBy';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { ColumnManager } from '@folio/stripes/smart-components';

import { AffiliationsSelection } from '../AffiliationsSelection';
import { EVENT_EMITTER_EVENTS } from '../constants';
import { FindRecords } from '../FindRecords';
import {
  useCampusesQuery,
  useCurrentUserTenants,
  useEventEmitter,
  useInstitutionsQuery,
  useLibrariesQuery,
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
    affiliationsLabel,
    crossTenant,
    filterRecords,
    idPrefix,
    isMultiSelect,
    modalLabel,
    onRecordsSelect,
    onTenantChange = noop,
    resultsPaneTitle,
    sortableColumns,
    tenantId,
    ...rest
  } = props;

  const filtersRefs = useRef({ resetFilters: noop });
  const eventEmitter = useEventEmitter();
  const currUserTenants = useCurrentUserTenants();

  const [selectedLocations, setSelectedLocations] = useState({});
  const [filters, setFilters] = useState({});

  const options = {
    tenantId,
    enabled: Boolean(tenantId),
    consortium: crossTenant,
  };

  const affiliations = useMemo(() => {
    return currUserTenants?.map(({ id, name, isPrimary }) => ({
      tenantId: id,
      tenantName: name,
      isPrimary,
    }));
  }, [currUserTenants]);

  const { institutions, isLoading: isInstitutionsLoading } = useInstitutionsQuery(options);
  const { campuses, isLoading: isCampusesLoading } = useCampusesQuery(options);
  const { libraries, isLoading: isLibrariesLoading } = useLibrariesQuery(options);

  const institutionsMap = useMemo(() => keyBy(institutions, 'id'), [institutions]);
  const campusesMap = useMemo(() => keyBy(campuses, 'id'), [campuses]);
  const librariesMap = useMemo(() => keyBy(libraries, 'id'), [libraries]);

  const { locations, isLoading: isLocationsLoading } = useLocationsRecords({
    filters,
    filterRecords,
    selectedLocations,
    institutionsMap,
    campusesMap,
    librariesMap,
    tenantId,
    crossTenant,
  });

  /*
    Subscribe on changes in selected records.
  */
  useEffect(() => {
    const callback = ({ detail: assignment }) => setSelectedLocations(assignment);

    eventEmitter.on(EVENT_EMITTER_EVENTS.FIND_RECORDS_SELECTED_CHANGED, callback);

    return () => {
      eventEmitter.off(EVENT_EMITTER_EVENTS.FIND_RECORDS_SELECTED_CHANGED, callback);
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

  const renderBeforeSearch = useCallback(() => {
    return crossTenant
      ? (
        <AffiliationsSelection
          affiliations={affiliations}
          label={affiliationsLabel}
          onChange={(tenant) => {
            onTenantChange?.(tenant);
            filtersRefs.current?.resetFilters();
          }}
          isLoading={isLoading}
          value={tenantId}
        />
      )
      : null;
  }, [
    affiliations,
    affiliationsLabel,
    crossTenant,
    isLoading,
    onTenantChange,
    tenantId,
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
          renderBeforeSearch={renderBeforeSearch}
          preventNonSelectedSubmit={false}
          filtersRef={filtersRefs}
          {...rest}
        />
      )}
    </ColumnManager>
  );
};

FindLocationLookup.propTypes = {
  affiliationsLabel: PropTypes.string,
  crossTenant: PropTypes.bool,
  filterRecords: PropTypes.func,
  idPrefix: PropTypes.string,
  isMultiSelect: PropTypes.bool,
  modalLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onRecordsSelect: PropTypes.func.isRequired,
  onTenantChange: PropTypes.func,
  resultsPaneTitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  tenantId: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

FindLocationLookup.defaultProps = {
  crossTenant: false,
  idPrefix: 'FindLocation-',
  isMultiSelect: false,
  modalLabel: <FormattedMessage id="stripes-acq-components.find-location.modal.label" />,
  resultsPaneTitle: <FormattedMessage id="stripes-acq-components.find-location.results.heading" />,
  sortableColumns: SORTABLE_COLUMNS,
};
