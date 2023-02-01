import PropTypes from 'prop-types';
import { keyBy, uniq } from 'lodash';
import { memo, useContext, useMemo } from 'react';
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
import { VersionCard } from '../VersionCard';
import { VersionViewContext } from '../VersionViewContext';

const paneTitle = <FormattedMessage id="stripes-acq-components.versionHistory.pane.header" />;

const VersionHistoryPane = ({
  currentVersion,
  id,
  isLoading: isLoadingProp,
  onClose,
  onSelectVersion,
  labelsMap,
  versions,
}) => {
  const intl = useIntl();
  const { paneTitleRef } = usePaneFocus();
  const versionContext = useContext(VersionViewContext);

  const userIds = useMemo(() => (
    uniq(versionContext?.versionsUsers?.map(({ id: userId }) => userId))
  ), [versionContext?.versionsUsers]);

  const { users, isLoading } = useUsersBatch(userIds);
  const usersMap = useMemo(() => keyBy(users, 'id'), [users]);

  const dataLostLabel = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.deletedRecord' });

  const versionsToDisplay = useMemo(() => (
    versions.filter((version, i) => {
      const changedFields = versionContext?.versionsMap?.[version.id]?.paths;

      return (i === versions.length - 1) || !!changedFields?.length;
    })
  ), [versionContext, versions]);

  const versionCards = useMemo(() => (
    versionsToDisplay.map(({
      id: versionId,
      eventDate,
      userId,
    }, i) => {
      const user = usersMap[userId];
      const changedFields = getFieldLabels(intl, versionContext?.versionsMap?.[versionId]?.paths, labelsMap);

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
          isLatest={i === 0}
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
    versionContext?.versionsMap,
    versionsToDisplay,
  ]);

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
      id={`versions-history-pane-${id}`}
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

VersionHistoryPane.propTypes = {
  currentVersion: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelectVersion: PropTypes.func.isRequired,
  labelsMap: PropTypes.object.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default memo(VersionHistoryPane);
