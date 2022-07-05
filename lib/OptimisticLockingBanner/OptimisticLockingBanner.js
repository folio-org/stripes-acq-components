import { useRef } from 'react';
import PropTypes from 'prop-types';

import { ConflictDetectionBanner } from '@folio/stripes/components';

const ERROR_CODE_CONFLICT = 'conflict';

const OptimisticLockingBanner = ({ latestVersionLink, errorCode }) => {
  const conflictDetectionBannerRef = useRef(null);
  const focusConflictDetectionBanner = () => conflictDetectionBannerRef.current.focus();

  return (
    errorCode === ERROR_CODE_CONFLICT && (
      <ConflictDetectionBanner
        latestVersionLink={latestVersionLink}
        conflictDetectionBannerRef={conflictDetectionBannerRef}
        focusConflictDetectionBanner={focusConflictDetectionBanner}
      />
    )
  );
};

OptimisticLockingBanner.propTypes = {
  latestVersionLink: PropTypes.string,
  errorCode: PropTypes.string,
};

export default OptimisticLockingBanner;
