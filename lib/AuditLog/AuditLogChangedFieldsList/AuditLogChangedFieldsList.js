import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  List,
} from '@folio/stripes/components';

import { getActionLabel } from '../getActionLabel';

const AuditLogChangedFieldsList = ({
  fieldChanges,
  fieldLabelsMap,
  onChangeButtonClick,
}) => {
  const { formatMessage } = useIntl();

  const actionsMap = { ...getActionLabel(formatMessage) };

  if (!fieldChanges) return '';

  const itemFormatter = (item, i) => {
    const {
      fieldName,
      changeType,
    } = item;

    return (
      <li key={i}>
        {`${fieldLabelsMap?.[fieldName] || fieldName} (${actionsMap[changeType]})`}
      </li>
    );
  };

  return (
    <div>
      <Button
        buttonStyle="link"
        onClick={onChangeButtonClick}
      >
        <FormattedMessage
          id="stripes-acq-components.versionHistory.card.changed"
          tagName="strong"
        />
      </Button>
      <List
        items={fieldChanges}
        itemFormatter={itemFormatter}
        listStyle="bullets"
        marginBottom0
      />
    </div>
  );
};

AuditLogChangedFieldsList.propTypes = {
  fieldChanges: PropTypes.arrayOf(PropTypes.shape({
    fieldName: PropTypes.string,
    changeType: PropTypes.string,
  })).isRequired,
  fieldLabelsMap: PropTypes.object,
  onChangeButtonClick: PropTypes.func,
};

export default AuditLogChangedFieldsList;
