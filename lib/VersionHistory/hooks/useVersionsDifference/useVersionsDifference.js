import { get, isObject, uniqBy } from 'lodash';
import { useMemo } from 'react';

import {
  FIELD_CHANGE_TYPES,
  finalFormPathBuilder,
  getObjectKey,
  objectDifference,
} from '../../../utils';

const getNestedObjectKeys = (path, value) => {
  if (!isObject(value)) return [path];

  return Object
    .entries(value)
    .flatMap(([key, val]) => getNestedObjectKeys(
      finalFormPathBuilder([path, getObjectKey(val, key)]),
      val,
    ));
};

const getNestedFieldPaths = (type, path, [oldValue, newValue]) => {
  const targetValue = type === FIELD_CHANGE_TYPES.delete ? oldValue : newValue;

  return getNestedObjectKeys(path, targetValue);
};

export const useVersionsDifference = (auditEvents, snapshotPath) => {
  const users = useMemo(() => uniqBy(auditEvents.map(({ userId, username }) => ({ id: userId, username })), 'id'), [auditEvents]);

  const versionsMap = useMemo(() => auditEvents.reduce((acc, event, i) => {
    const snapshot = get(event, snapshotPath, {});

    acc[event.id] = (i === (auditEvents.length - 1))
      ? null
      : objectDifference(get(auditEvents[i + 1], snapshotPath, {}), snapshot)
        .reduce((accum, item) => {
          const { path, type, values } = item;
          const paths = type === FIELD_CHANGE_TYPES.update
            ? [path]
            : getNestedFieldPaths(type, path, values);

          accum.changes.push(item);
          accum.paths.push(...paths);

          return accum;
        }, {
          changes: [],
          paths: [],
        });

    return acc;
  }, {}), [auditEvents, snapshotPath]);

  return { versionsMap, users };
};
