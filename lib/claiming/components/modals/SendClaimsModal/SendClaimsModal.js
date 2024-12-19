import identity from 'lodash/identity';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';
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
  TextArea,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';

import { ModalFooter } from '../../../../ModalFooter';
import { FieldClaimingDate } from '../../FieldClaimingDate';

const SendClaimsModal = ({
  claimsCount,
  handleSubmit,
  onCancel,
  open,
  message,
}) => {
  const { reset } = useForm();
  const intl = useIntl();
  const modalLabel = intl.formatMessage(
    { id: 'stripes-acq-components.claiming.modal.sendClaim.heading' },
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
      marginBottom0
      onClick={handleSubmit}
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
      id="send-claim-modal"
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
            <FieldClaimingDate label={<FormattedMessage id="stripes-acq-components.claiming.modal.sendClaim.field.claimExpiryDate" />} />
          </Col>
        </Row>

        <Row>
          <Col xs>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="stripes-acq-components.claiming.modal.sendClaim.field.internalNote" />}
              name="internalNote"
              parse={identity}
            />
          </Col>
          <Col xs>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="stripes-acq-components.claiming.modal.sendClaim.field.externalNote" />}
              name="externalNote"
              parse={identity}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

SendClaimsModal.propTypes = {
  claimsCount: PropTypes.number,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
  message: PropTypes.node,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(SendClaimsModal);
