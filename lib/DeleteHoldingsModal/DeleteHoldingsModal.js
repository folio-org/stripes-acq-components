import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Modal,
} from '@folio/stripes/components';

import { ModalFooter } from '../ModalFooter';

export const DeleteHoldingsModal = ({
  deleteHoldingsLabel = <FormattedMessage id="stripes-acq-components.holdings.deleteModal.heading" />,
  keepHoldingsLabel = <FormattedMessage id="stripes-acq-components.holdings.deleteModal.keepHoldings" />,
  message = <FormattedMessage id="stripes-acq-components.holdings.deleteModal.message" />,
  onCancel,
  onConfirm,
  onKeepHoldings,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'stripes-acq-components.holdings.deleteModal.heading' });

  const start = (
    <Button
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="stripes-core.button.cancel" />
    </Button>
  );
  const end = (
    <>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onKeepHoldings}
      >
        {keepHoldingsLabel}
      </Button>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
      >
        {deleteHoldingsLabel}
      </Button>
    </>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      aria-label={modalLabel}
      id="delete-holdings-confirmation"
      footer={footer}
      label={modalLabel}
      size="small"
      open
    >
      {message}
    </Modal>
  );
};

DeleteHoldingsModal.propTypes = {
  deleteHoldingsLabel: PropTypes.node,
  keepHoldingsLabel: PropTypes.node,
  message: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onKeepHoldings: PropTypes.func.isRequired,
};
