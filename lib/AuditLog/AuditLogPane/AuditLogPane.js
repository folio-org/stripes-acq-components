import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  keyBy,
  uniq,
} from 'lodash';

import {
  LoadingPane,
  Pane,
} from '@folio/stripes/components';

import { AuditLogCard } from '../AuditLogCard';

import {
  usePaneFocus,
  useUsersBatch,
} from '../../hooks';

const paneTitle = <FormattedMessage id="stripes-acq-components.versionHistory.pane.header" />;
const ACTION_CREATE = 'CREATE';

const AuditLogPane = ({
  versions,
  onClose,
  fieldLabelsMap,
  fieldFormatter,
  isLoading: isLoadingProp,
}) => {
  const { paneTitleRef } = usePaneFocus();

  const versionsToDisplay = versions.filter(version => version.action !== ACTION_CREATE);
  const usersId = useMemo(
    () => {
      return uniq(versionsToDisplay.map(version => version.userId));
    }, [versionsToDisplay],
  );

  const { users, isLoading } = useUsersBatch(usersId);
  const usersMap = useMemo(() => keyBy(users, 'id'), [users]);

  const versionCards = useMemo(() => {
    return versionsToDisplay.map(({
      eventDate,
      userId,
      action,
      diff,
    }, i) => {
      const user = usersMap[userId];

      return (
        <AuditLogCard
          key={i}
          date={eventDate}
          user={user}
          action={action}
          diff={diff}
          fieldLabelsMap={fieldLabelsMap}
          fieldFormatter={fieldFormatter}
        />
      );
    });
  }, [versionsToDisplay, usersMap, fieldLabelsMap, fieldFormatter]);

  if (isLoading || isLoadingProp) {
    return (
      <LoadingPane
        defaultWidth="20%"
        dismissible
        onClose={onClose}
        paneTitle={paneTitle}
      />
    );
  }

  return (
    <Pane
      defaultWidth="20%"
      paneTitle={paneTitle}
      paneTitleRef={paneTitleRef}
      paneSub={(
        <FormattedMessage
          id="stripes-acq-components.versionHistory.pane.sub"
          values={{ count: versionsToDisplay.length }}
        />
      )}
      dismissible
      onClose={onClose}
    >
      {versionCards}
    </Pane>
  );
};

AuditLogPane.propTypes = {
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func,
  fieldLabelsMap: PropTypes.object,
  fieldFormatter: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default AuditLogPane;
