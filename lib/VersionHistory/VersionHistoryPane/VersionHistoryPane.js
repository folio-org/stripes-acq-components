import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';

export const VersionHistoryPane = ({
  id,
  onClose,
  versions,
}) => {
  return (
    <Pane
      id={`versions-history-pane-${id}`}
      defaultWidth="20%"
      paneTitle={<FormattedMessage id="stripes-acq-components.versionHistory.pane.header" />}
      paneSub={(
        <FormattedMessage
          id="stripes-acq-components.versionHistory.pane.sub"
          values={{ count: versions.length }}
        />
      )}
      dismissible
      onClose={onClose}
    >
      {/* TODO: implement version history cards (UIOR-858) */}
      {versions.map((_version, i) => `Version ${versions.length - i}`)}
    </Pane>
  );
};

VersionHistoryPane.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
};
