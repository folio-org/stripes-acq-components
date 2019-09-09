import { ACQUISITIONS_UNIT_MEMBERSHIPS_API } from '../../../../lib';

const configMemberships = server => {
  server.get(ACQUISITIONS_UNIT_MEMBERSHIPS_API, () => {
    return [];
  });
};

export default configMemberships;
