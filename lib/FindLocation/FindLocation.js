import { useCallback, useRef, useState } from 'react';

import { Button } from '@folio/stripes/components';

import { FindLocationLookup } from './FindLocationLookup';

export const FindLocation = (props) => {
  const {
    id,
    disabled,
    marginBottom0,
    onClose,
    renderTrigger,
    searchButtonStyle,
    searchLabel,
    trigerless,
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
  ]);

  const renderTriggerButton = useCallback(() => {
    return renderTrigger
      ? renderTrigger({
        buttonRef: modalTriggerRef,
        onClick: () => setOpenModal(true),
      })
      : renderDefaultTrigger();
  }, []);

  return (
    <>
      {!trigerless && renderTriggerButton()}
      {(openModal || trigerless) && (
        <FindLocationLookup
          onClose={onModalClose}
          trigerless
          {...rest}
        />
      )}
    </>
  )
};
