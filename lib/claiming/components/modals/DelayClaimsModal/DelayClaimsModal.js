import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Col,
  Layout,
  Modal,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import { ModalFooter } from '../../../../ModalFooter';
import { FieldClaimingDate } from '../../FieldClaimingDate';

const DelayClaimsModal = ({
  claimsCount,
  handleSubmit,
  message,
  onCancel,
  open,
}) => {
  const { reset } = useForm();
  const intl = useIntl();
  const modalLabel = intl.formatMessage(
    { id: 'stripes-acq-components.claiming.modal.delayClaim.heading' },
    { count: claimsCount },
  );

  const handleCancel = useCallback(() => {
    onCancel();
    reset();
  }, [onCancel, reset]);

  const start = (
    <Button
      marginBottom0
      onClick={handleCancel}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );
  const end = (
    <Button
      buttonStyle="primary"
      onClick={handleSubmit}
      marginBottom0
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.save" />
    </Button>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      open={open}
      id="delay-claim-modal"
      size="small"
      footer={footer}
      label={modalLabel}
      aria-label={modalLabel}
    >
      <form onSubmit={handleSubmit}>
        {message && (
          <Row>
            <Col xs>
              <Layout className="padding-bottom-gutter">
                {message}
              </Layout>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs>
            <FieldClaimingDate label={<FormattedMessage id="stripes-acq-components.claiming.modal.delayClaim.field.delayTo" />} />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

DelayClaimsModal.propTypes = {
  claimsCount: PropTypes.number,
  handleSubmit: PropTypes.func.isRequired,
  message: PropTypes.node,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(DelayClaimsModal);
