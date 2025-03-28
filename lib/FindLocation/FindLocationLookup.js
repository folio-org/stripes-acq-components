import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { ColumnManager } from '@folio/stripes/smart-components';

import { AffiliationsSelection } from '../AffiliationsSelection';
import { EVENT_EMITTER_EVENTS } from '../constants';
import { FindRecords } from '../FindRecords';
import {
  useCampusesQuery,
  useConsortiumTenants,
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

const INITIAL_FILTERS = {};
const DEFAULT_MODAL_LABEL = <FormattedMessage id="stripes-acq-components.find-location.modal.label" />;
const DEFAULT_RESULTS_PANE_TITLE = <FormattedMessage id="stripes-acq-components.find-location.results.heading" />;

export const FindLocationLookup = (props) => {
  const {
    affiliationsLabel,
    /* If true, the component will use only assigned affiliations for the current user. */
    assignedAffiliationsOnly = false,
    /* If true, the component will render affiliation selection with available tenants. */
    crossTenant = false,
    filterRecords,
    idPrefix = 'FindLocation-',
    isMultiSelect = false,
    modalLabel = DEFAULT_MODAL_LABEL,
    onRecordsSelect,
    onTenantChange = noop,
    resultsPaneTitle = DEFAULT_RESULTS_PANE_TITLE,
    sortableColumns = SORTABLE_COLUMNS,
    tenantId,
    tenantsList = [],
    ...rest
  } = props;

  const eventEmitter = useEventEmitter();
  const currUserTenants = useCurrentUserTenants();

  const [selectedLocations, setSelectedLocations] = useState({});
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const {
    tenants,
    isLoading: isTenantsLoading,
  } = useConsortiumTenants({
    /* Don't send a request if we are in crossTenant mode and we have to use only assigned affiliations */
    enabled: crossTenant && !assignedAffiliationsOnly,
  });

  const options = {
    tenantId,
    enabled: Boolean(tenantId),
    consortium: crossTenant,
  };

  const affiliations = useMemo(() => {
    const affiliationsMap = currUserTenants?.reduce((acc, affiliation) => {
      return acc.set(affiliation.id, affiliation);
    }, new Map());

    const defaultTenantsList = assignedAffiliationsOnly ? currUserTenants : tenants;
    const userTenants = isEmpty(tenantsList) ? defaultTenantsList : tenantsList;

    return userTenants?.map(({ id, name, isPrimary }) => ({
      tenantId: id,
      tenantName: name,
      isPrimary: isPrimary || affiliationsMap?.get(id)?.isPrimary,
    }));
  }, [assignedAffiliationsOnly, currUserTenants, tenants, tenantsList]);

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
    isTenantsLoading
    || isLocationsLoading
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

  const renderBeforeSearch = useCallback((resetFilters) => {
    return crossTenant
      ? (
        <AffiliationsSelection
          affiliations={affiliations}
          label={affiliationsLabel}
          onChange={(tenant) => {
            onTenantChange?.(tenant);
            resetFilters?.();
            setFilters(INITIAL_FILTERS);
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
          {...rest}
        />
      )}
    </ColumnManager>
  );
};

FindLocationLookup.propTypes = {
  affiliationsLabel: PropTypes.string,
  assignedAffiliationsOnly: PropTypes.bool,
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
  tenantsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    isPrimary: PropTypes.bool,
  })),
};
