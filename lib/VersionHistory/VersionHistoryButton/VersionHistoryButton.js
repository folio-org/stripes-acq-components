import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { IconButton } from '@folio/stripes/components';

export const VersionHistoryButton = ({
  disabled,
  onClick,
  versionsCount,
}) => {
  const intl = useIntl();
  const title = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.pane.header' });

  return (
    <IconButton
      ariaLabel={title}
      disabled={disabled}
      badgeCount={versionsCount}
      icon="clock"
      id="version-history-btn"
      onClick={onClick}
      title={title}
    />
  );
};

VersionHistoryButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  versionsCount: PropTypes.number,
};
