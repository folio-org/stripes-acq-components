import get from 'lodash/get';

export const getVersionMetadata = (version, entity) => ({
  ...get(entity, 'metadata', {}),
  updatedByUserId: version?.userId,
  updatedDate: version?.eventDate,
});
