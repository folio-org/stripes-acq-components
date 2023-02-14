import { useContext, useMemo } from 'react';

import { getVersionWrappedFormatter } from '../../getVersionWrappedFormatter';
import { VersionViewContext } from '../../VersionViewContext';

export const useVersionWrappedFormatter = ({ baseFormatter, name, fieldsMapping }) => {
  const versionContext = useContext(VersionViewContext);

  const formatter = useMemo(() => {
    if (!versionContext || !name || !fieldsMapping) return baseFormatter;

    return getVersionWrappedFormatter({
      baseFormatter,
      fieldsMapping,
      name,
      paths: versionContext.paths,
    });
  }, [baseFormatter, fieldsMapping, name, versionContext]);

  return formatter;
};
