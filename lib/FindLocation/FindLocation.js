import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { ConsortiumLocationsContextProvider } from '../consortia';
import { LocationsContextProvider } from '../contexts';
import { useEventEmitter } from '../hooks';
import { emitInitialSelectedRecords } from './emitInitialSelectedRecords';
import { FindLocationLookup } from './FindLocationLookup';

export const FindLocation = (props) => {
  const {
    crossTenant,
    disabled,
    id,
    initialSelected,
    marginBottom0,
    onClose,
    renderTrigger,
    searchButtonStyle,
    searchLabel,
    tenantId: tenantIdProp,
    triggerless,
    ...rest
  } = props;
  const stripes = useStripes();
  const eventEmitter = useEventEmitter();
  const modalTriggerRef = useRef();

  const [openModal, setOpenModal] = useState(false);
  const [tenantId, setTenantId] = useState(tenantIdProp || stripes.okapi.tenant);

  const ContextProvider = crossTenant
    ? ConsortiumLocationsContextProvider
    : LocationsContextProvider;

  const contextOptions = useMemo(() => ({
    tenantId,
    onSuccess: emitInitialSelectedRecords.bind(null, eventEmitter, initialSelected),
  }), [eventEmitter, initialSelected, tenantId]);

  const onModalClose = useCallback((data) => {
    setOpenModal(false);
    onClose?.(data);
  }, [onClose]);

  const renderDefaultTrigger = useCallback(() => {
    return (
      <Button
        id={id}
        buttonRef={modalTriggerRef}
        buttonStyle={searchButtonStyle}
        disabled={disabled}
        key="searchButton"
        marginBottom0={marginBottom0}
        onClick={() => setOpenModal(true)}
      >
        {searchLabel}
      </Button>
    );
  }, [
    disabled,
    id,
    marginBottom0,
    searchButtonStyle,
    searchLabel,
  ]);

  const renderTriggerButton = useCallback(() => {
    return renderTrigger
      ? renderTrigger({
        buttonRef: modalTriggerRef,
        onClick: () => setOpenModal(true),
      })
      : renderDefaultTrigger();
  }, [renderDefaultTrigger, renderTrigger]);

  return (
    <>
      {!triggerless && renderTriggerButton()}
      {(openModal || triggerless) && (
        <ContextProvider options={contextOptions}>
          <FindLocationLookup
            crossTenant={crossTenant}
            onClose={onModalClose}
            onTenantChange={setTenantId}
            tenantId={tenantId}
            {...rest}
          />
        </ContextProvider>
      )}
    </>
  );
};

FindLocation.propTypes = {
  crossTenant: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  initialSelected: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    tenantId: PropTypes.string,
  })),
  marginBottom0: PropTypes.bool,
  onClose: PropTypes.func,
  onRecordsSelect: PropTypes.func.isRequired,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  tenantId: PropTypes.string,
  triggerless: PropTypes.bool,
};

FindLocation.defaultProps = {
  crossTenant: false,
  disabled: false,
  initialSelected: [],
  marginBottom0: false,
  triggerless: false,
};
