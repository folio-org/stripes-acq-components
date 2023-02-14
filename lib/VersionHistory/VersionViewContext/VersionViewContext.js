import PropTypes from 'prop-types';
import { createContext, useMemo } from 'react';
import { get } from 'lodash';

import { useVersionsDifference } from '../hooks/useVersionsDifference';

export const VersionViewContext = createContext();

export const VersionViewContextProvider = ({
  children,
  snapshotPath,
  versionId,
  versions,
}) => {
  const { versionsMap, users: versionsUsers } = useVersionsDifference(versions, snapshotPath);
  const { changes = [], paths = [] } = useMemo(() => get(versionsMap, versionId, {}) || {}, [versionId, versionsMap]);

  const contextValue = useMemo(() => ({
    changes,
    paths,
    versions,
    versionsMap,
    versionsUsers,
  }), [changes, paths, versions, versionsMap, versionsUsers]);

  return (
    <VersionViewContext.Provider value={contextValue}>
      {children}
    </VersionViewContext.Provider>
  );
};

VersionViewContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  snapshotPath: PropTypes.string.isRequired,
  versionId: PropTypes.string.isRequired,
  versions: PropTypes.arrayOf(PropTypes.object).isRequired,
};
