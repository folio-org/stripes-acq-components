import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@folio/stripes/components';

import { FindLocationLookup } from './FindLocationLookup';

export const FindLocation = (props) => {
  const {
    crossTenant,
    id,
    disabled,
    marginBottom0,
    onClose,
    renderTrigger,
    searchButtonStyle,
    searchLabel,
    triggerless,
    ...rest
  } = props;

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
        <FindLocationLookup
          onClose={onModalClose}
          crossTenant={crossTenant}
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
  marginBottom0: PropTypes.bool,
  onClose: PropTypes.func,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  triggerless: PropTypes.bool,
};

FindLocation.defaultProps = {
  crossTenant: false,
};
