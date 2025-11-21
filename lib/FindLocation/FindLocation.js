import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import { FindLocationLookupContainer } from './FindLocationLookupContainer';

const DEFAULT_INITIAL_SELECTED = [];

export const FindLocation = ({
  crossTenant = false,
  disabled = false,
  id,
  initialSelected = DEFAULT_INITIAL_SELECTED,
  marginBottom0 = false,
  onClose,
  renderTrigger,
  searchButtonStyle,
  searchLabel = <FormattedMessage id="stripes-smart-components.ll.locationLookup" />,
  triggerless = false,
  ...rest
}) => {
  const modalTriggerRef = useRef();

  const [openModal, setOpenModal] = useState(false);

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
        <FindLocationLookupContainer
          crossTenant={crossTenant}
          initialSelected={initialSelected}
          onClose={onModalClose}
          {...rest}
        />
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
