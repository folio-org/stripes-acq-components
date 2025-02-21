import { useMemo } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  map,
  sortBy,
} from 'lodash';
import PropTypes from 'prop-types';

import {
  Button,
  List,
  Modal,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { getActionLabel } from '../getActionLabel';

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
    changedFrom: item => {
      if (!item.oldValue) return <NoValue />;

      if (typeof item.oldValue === 'object' && !Array.isArray(item.oldValue)) {
        return (
          <List
            items={map(item.oldValue, (value, name) => ({ name, value }))}
            itemFormatter={itemFormatter}
            listStyle="bullets"
            marginBottom0
          />
        );
      }

      return fieldFormatter[item.fieldName]?.(item.oldValue) || item.oldValue;
    },
    changedTo: item => {
      if (!item.newValue) return <NoValue />;

      if (typeof item.newValue === 'object' && !Array.isArray(item.newValue)) {
        return (
          <List
            items={map(item.newValue, (value, name) => ({ name, value }))}
            itemFormatter={itemFormatter}
            listStyle="bullets"
            marginBottom0
          />
        );
      }

      return fieldFormatter[item.fieldName]?.(item.newValue) || item.newValue;
    },
  };

  const modalFooter = (
    <>
      <Button
        onClick={onClose}
        buttonStyle="primary"
        marginBottom0
      >
        <FormattedMessage id="stripes-acq-components.button.close" />
      </Button>
    </>
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
