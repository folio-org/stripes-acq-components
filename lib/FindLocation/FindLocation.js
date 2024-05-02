import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Button } from '@folio/stripes/components';

import { FindLocationLookupContainer } from './FindLocationLookupContainer';

export const FindLocation = (props) => {
  const {
    disabled,
    id,
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
        <FindLocationLookupContainer
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

FindLocation.defaultProps = {
  crossTenant: false,
  disabled: false,
  initialSelected: [],
  marginBottom0: false,
  triggerless: false,
};
