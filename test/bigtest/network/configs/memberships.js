import { ACQUISITIONS_UNIT_MEMBERSHIPS_API } from '../../../../lib';

const configMemberships = server => {
  server.get(ACQUISITIONS_UNIT_MEMBERSHIPS_API, () => {
    return {
      acquisitionsUnitMemberships: [],
      totalRecords: 0,
    };
  });
};

export default configMemberships;
