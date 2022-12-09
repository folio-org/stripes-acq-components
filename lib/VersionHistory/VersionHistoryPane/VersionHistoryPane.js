import PropTypes from 'prop-types';
import { keyBy, uniq } from 'lodash';
import { memo, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import {
  LoadingPane,
  Pane,
} from '@folio/stripes/components';

import { FolioFormattedTime } from '../../FolioFormattedTime';
import {
  usePaneFocus,
  useUsersBatch,
} from '../../hooks';
import { getFieldLabels } from '../getFieldLabels';
import { useVersionsDifference } from '../hooks';
import { VersionCard } from '../VersionCard';

const VersionHistoryPane = ({
  currentVersion,
  id,
  onClose,
  onSelectVersion,
  labelsMap,
  snapshotPath,
  versions,
}) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();

  const { versionsMap, users: versionUsers } = useVersionsDifference(versions, snapshotPath);
  const userIds = useMemo(() => uniq(versionUsers.map(({ id: userId }) => userId)), [versionUsers]);

  const { users, isLoading } = useUsersBatch(userIds);
  const usersMap = useMemo(() => keyBy(users, 'id'), [users]);

  const dataLostLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.dataLost' });

  const versionCards = useMemo(() => (
    versions.map(({
      id: versionId,
      eventDate,
      userId,
    }) => {
      const user = usersMap[userId];
      const changedFields = getFieldLabels(intl, versionsMap[versionId]?.paths, labelsMap);

      const source = (
        <FormattedMessage
          id="stripes-components.metaSection.source"
          values={{
            source: user
              ? <Link to={`/users/preview/${userId}`}>{user.personal.lastName}, {user.personal.firstName}</Link>
              : dataLostLabel,
          }}
        />
      );

      return (
        <VersionCard
          key={versionId}
          id={versionId}
          isCurrent={versionId === currentVersion}
          onSelect={onSelectVersion}
          title={<FolioFormattedTime dateString={eventDate} />}
          source={source}
          changedFields={changedFields}
        />
      );
    })
  ), [
    currentVersion,
    dataLostLabel,
    intl,
    labelsMap,
    onSelectVersion,
    usersMap,
    versions,
    versionsMap,
  ]);

  if (isLoading) return <LoadingPane />;

  return (
    <Pane
      id={`versions-history-pane-${id}`}
      defaultWidth="20%"
      paneTitle={<FormattedMessage id="stripes-acq-components.versionHistory.pane.header" />}
      paneTitleRef={paneTitleRef}
      paneSub={(
        <FormattedMessage
          id="stripes-acq-components.versionHistory.pane.sub"
          values={{ count: versions.length }}
        />
      )}
      dismissible
      onClose={onClose}
    >
      {versionCards}
    </Pane>
  );
};

VersionHistoryPane.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectVersion: PropTypes.func.isRequired,
  labelsMap: PropTypes.object.isRequired,
  snapshotPath: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(VersionHistoryPane);
