import {
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import PropTypes from 'prop-types';

import { Card } from '@folio/stripes/components';

import { AuditLogChangedFieldsList } from '../AuditLogChangedFieldsList';
import { AuditLogModal } from '../AuditLogModal';

import { getChangedFieldsList } from '../getChangedFieldsList';
import { getDateWithTime } from '../../utils';

import css from './AuditLogCard.css';

const AuditLogCard = ({
  date,
  user,
  diff,
  fieldLabelsMap,
  fieldFormatter,
}) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const anonymousUserLabel = formatMessage({ id: 'stripes-acq-components.audit-log.anonymousUser' });

  const headerStart = useMemo(() => {
    return (
      <b>
        {getDateWithTime(date)}
      </b>
    );
  }, [date]);

  const userName = useMemo(
    () => {
      return user ? `${user.personal.lastName}, ${user.personal.firstName}` : null;
    }, [user],
  );

  const sourceUser = (
    <FormattedMessage
      id="stripes-components.metaSection.source"
      tagName="p"
      values={{
        source: user
          ? <Link to={`/users/preview/${user.id}`}>{userName}</Link>
          : anonymousUserLabel,
      }}
    />
  );

  const modalHeader = (
    <>
      {getDateWithTime(date)}
      <br />
      <FormattedMessage
        id="stripes-components.metaSection.source"
        values={{
          source: userName || anonymousUserLabel,
        }}
      />
    </>
  );

  const changedFieldsList = useMemo(
    () => getChangedFieldsList(diff),
    [diff],
  );

  const onChangeButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card
        cardClass={css.card}
        headerStart={headerStart}
        cardStyle="positive"
        roundedBorder
      >
        {sourceUser}
        <AuditLogChangedFieldsList
          fieldChanges={changedFieldsList}
          fieldLabelsMap={fieldLabelsMap}
          onChangeButtonClick={onChangeButtonClick}
        />
      </Card>
      <AuditLogModal
        contentData={changedFieldsList}
        open={isModalOpen}
        label={modalHeader}
        onClose={() => setIsModalOpen(false)}
        fieldLabelsMap={fieldLabelsMap}
        fieldFormatter={fieldFormatter}
      />
    </>
  );
};

AuditLogCard.propTypes = {
  date: PropTypes.string.isRequired,
  diff: PropTypes.shape({
    fieldChanges: PropTypes.arrayOf(PropTypes.object),
    collectionChanges: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  user: PropTypes.object,
  fieldLabelsMap: PropTypes.object,
  fieldFormatter: PropTypes.object,
};

export default AuditLogCard;
