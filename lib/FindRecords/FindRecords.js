import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import contains from 'dom-helpers/query/contains';

import {
  Button,
} from '@folio/stripes/components';

import { FindRecordsModal } from './FindRecordsModal';

export const FindRecords = ({
  onClose,
  selectRecords,
  searchButtonStyle,
  disabled,
  marginBottom0,
  searchLabel,
  renderTrigger,
  trigerless,
  ...rest
}) => {
  const modalTrigger = useRef();
  const modalRef = useRef();
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    if (
      modalRef.current
      && modalTrigger.current
      && contains(modalRef.current, document.activeElement)
    ) {
      modalTrigger.current.focus();
    }

    setOpenModal(false);

    onClose?.();
  };

  const passRecordsOut = selectedRecords => {
    selectRecords(selectedRecords);
    closeModal();
  };

  const passRecordOut = (e, record) => {
    passRecordsOut([record]);
  };

  const renderDefaultTrigger = () => {
    return (
      <Button
        buttonRef={modalTrigger}
        buttonStyle={searchButtonStyle}
        data-test-plugin-find-record-button
        disabled={disabled}
        key="searchButton"
        marginBottom0={marginBottom0}
        onClick={() => setOpenModal(true)}
      >
        {searchLabel}
      </Button>
    );
  };

  const renderTriggerButton = () => {
    return renderTrigger
      ? renderTrigger({
        buttonRef: modalTrigger,
        onClick: openModal,
      })
      : renderDefaultTrigger();
  };

  return (
    <div>
      {
        !trigerless && renderTriggerButton()
      }

      {
        (openModal || trigerless) && (
          <FindRecordsModal
            modalRef={modalRef}
            closeModal={closeModal}
            onSaveMultiple={passRecordsOut}
            onSelectRow={passRecordOut}
            {...rest}
          />
        )
      }
    </div>
  );
};

FindRecords.propTypes = {
  marginBottom0: PropTypes.bool,
  renderTrigger: PropTypes.func,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  disabled: PropTypes.bool,
  trigerless: PropTypes.bool,
  onClose: PropTypes.func,
  selectRecords: PropTypes.func.isRequired,
};
