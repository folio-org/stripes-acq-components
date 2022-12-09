import { get, uniqBy } from 'lodash';
import { useMemo } from 'react';

import { objectDifference } from '../../../utils';

export const useVersionsDifference = (auditEvents, snapshotPath) => {
  const users = useMemo(() => uniqBy(auditEvents.map(({ userId, username }) => ({ id: userId, username })), 'id'), [auditEvents]);

  const versionsMap = useMemo(() => auditEvents.reduce((acc, event, i) => {
    const snapshot = get(event, snapshotPath, {});

    acc[event.id] = (i === (auditEvents.length - 1))
      ? null
      : objectDifference(get(auditEvents[i + 1], snapshotPath, {}), snapshot).reduce((accum, item) => {
        accum.changes.push(item);
        accum.paths.push(item.path);

        return accum;
      }, {
        changes: [],
        paths: [],
      });

    return acc;
  }, {}), [auditEvents, snapshotPath]);

  return { versionsMap, users };
};
