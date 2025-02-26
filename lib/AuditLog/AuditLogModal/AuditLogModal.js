import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  MultiColumnList,
} from '@folio/stripes/components';

import { getActionLabel } from '../getActionLabel';
import changedFieldsFormatter from './changedFieldsFormatter';

const AuditLogModal = ({
  contentData,
  label,
  open,
  onClose,
  fieldLabelsMap,
  fieldFormatter,
}) => {
  const { formatMessage } = useIntl();

  const sortedContentData = useMemo(
    () => sortBy(contentData, data => data.changeType),
    [contentData],
  );
  const actionsMap = { ...getActionLabel(formatMessage) };
  const visibleColumns = ['action', 'field', 'changedFrom', 'changedTo'];
  const columnMapping = {
    action: <FormattedMessage id="stripes-acq-components.audit-log.modal.action" />,
    field: <FormattedMessage id="stripes-acq-components.audit-log.modal.field" />,
    changedFrom: <FormattedMessage id="stripes-acq-components.audit-log.modal.changedFrom" />,
    changedTo: <FormattedMessage id="stripes-acq-components.audit-log.modal.changedTo" />,
  };
  const itemFormatter = (field, i) => {
    return (
      <li key={i}>
        {fieldFormatter[field.name]?.(field.value) || field.value}
      </li>
    );
  };
  const formatter = {
    action: item => actionsMap[item.changeType],
    field: item => fieldLabelsMap?.[item.fieldName] || item.fieldName,
    changedFrom: item => changedFieldsFormatter({
      fieldValue: item.oldValue,
      fieldName: item.fieldName,
      listItemFormatter: itemFormatter,
      fieldFormatter,
    }),
    changedTo: item => changedFieldsFormatter({
      fieldValue: item.newValue,
      fieldName: item.fieldName,
      listItemFormatter: itemFormatter,
      fieldFormatter,
    }),
  };

  const modalFooter = (
    <Button
      onClick={onClose}
      buttonStyle="primary"
      marginBottom0
    >
      <FormattedMessage id="stripes-acq-components.button.close" />
    </Button>
  );

  return (
    <Modal
      open={open}
      label={label}
      onClose={onClose}
      footer={modalFooter}
      dismissible
    >
      <MultiColumnList
        contentData={sortedContentData}
        columnMapping={columnMapping}
        visibleColumns={visibleColumns}
        formatter={formatter}
        interactive={false}
      />
    </Modal>
  );
};

AuditLogModal.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  label: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  fieldLabelsMap: PropTypes.object,
  fieldFormatter: PropTypes.object,
};

export default AuditLogModal;
