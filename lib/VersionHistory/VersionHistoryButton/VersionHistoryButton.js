import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  IconButton,
  Tooltip,
} from '@folio/stripes/components';

export const VersionHistoryButton = ({
  disabled,
  onClick,
  versionsCount,
}) => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({ id: 'stripes-acq-components.versionHistory.pane.header' });

  return (
    <Tooltip
      text={tooltip}
      id="version-history-tooltip"
    >
      {({ ref, ariaIds }) => (
        <IconButton
          ref={ref}
          aria-labelledby={ariaIds.text}
          disabled={disabled}
          badgeCount={versionsCount}
          icon="clock"
          id="version-history-btn"
          onClick={onClick}
        />
      )}
    </Tooltip>
  );
};

VersionHistoryButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  versionsCount: PropTypes.number,
};
