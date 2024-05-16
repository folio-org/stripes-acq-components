import PropTypes from 'prop-types';
import {
  useMemo,
  useState,
} from 'react';

import { useStripes } from '@folio/stripes/core';

import { ConsortiumLocationsContextProvider } from '../consortia/contexts';
import { LocationsContextProvider } from '../contexts';
import { useEventEmitter } from '../hooks';
import { emitInitialSelectedRecords } from './emitInitialSelectedRecords';
import { FindLocationLookup } from './FindLocationLookup';

export const FindLocationLookupContainer = ({
  crossTenant,
  initialSelected,
  tenantId: tenantIdProp,
  ...rest
}) => {
  const stripes = useStripes();
  const eventEmitter = useEventEmitter();

  const [tenantId, setTenantId] = useState(tenantIdProp || stripes.okapi.tenant);

  const ContextProvider = crossTenant
    ? ConsortiumLocationsContextProvider
    : LocationsContextProvider;

  const contextOptions = useMemo(() => ({
    tenantId,
    onSuccess: emitInitialSelectedRecords.bind(null, eventEmitter, initialSelected),
  }), [eventEmitter, initialSelected, tenantId]);

  return (
    <ContextProvider options={contextOptions}>
      <FindLocationLookup
        crossTenant={crossTenant}
        onTenantChange={setTenantId}
        tenantId={tenantId}
        {...rest}
      />
    </ContextProvider>
  );
};

FindLocationLookupContainer.propTypes = {
  crossTenant: PropTypes.bool,
  filterRecords: PropTypes.func,
  idPrefix: PropTypes.string,
  initialSelected: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tenantId: PropTypes.string,
  })),
  isMultiSelect: PropTypes.bool,
  modalLabel: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onRecordsSelect: PropTypes.func.isRequired,
  onTenantChange: PropTypes.func,
  resultsPaneTitle: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sortableColumns: PropTypes.arrayOf(PropTypes.string),
  tenantId: PropTypes.string,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
