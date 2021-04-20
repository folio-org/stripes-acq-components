import { useQuery } from 'react-query';
import { useStripes, useOkapiKy } from '@folio/stripes/core';

import { LIMIT_MAX } from '../../../constants';

const useAcqMemberships = (entityId, acqUnits = []) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const userId = stripes.user?.user?.id;

  const acqUnitsQuery = acqUnits.map(id => `acquisitionsUnitId=${id}`).join(' or ');
  const searchParams = {
    limit: LIMIT_MAX,
    query: `userId=${userId} and (${acqUnitsQuery})`,
  };

  const { data = {}, isFetching } = useQuery(
    ['stripes-acq-components', 'acq-restrictions-memberships', entityId],
    () => ky.get('acquisitions-units/memberships', { searchParams }).json(),
    { enabled: Boolean(acqUnits.length) },
  );

  return {
    isLoading: isFetching,
    acqUnitMemberships: data.acquisitionsUnitMemberships || [],
  };
};

const useAcqUnits = (entityId, enabled, acqUnits = []) => {
  const ky = useOkapiKy();

  const acqUnitsQuery = acqUnits.map(id => `id=${id}`).join(' or ');
  const searchParams = {
    limit: LIMIT_MAX,
    query: `(${acqUnitsQuery})`,
  };
  const { data = {}, isFetching } = useQuery(
    ['stripes-acq-components', 'acq-restrictions-units', entityId],
    () => ky.get('acquisitions-units/units', { searchParams }).json(),
    { enabled },
  );

  return {
    isLoading: isFetching,
    acqUnits: data.acquisitionsUnits || [],
  };
};

export const useAcqRestrictions = (entityId, acqUnitIds = []) => {
  const {
    isLoading: isMembershipsLoading,
    acqUnitMemberships,
  } = useAcqMemberships(entityId, acqUnitIds);

  const {
    isLoading: isUnitsLoading,
    acqUnits,
  } = useAcqUnits(
    entityId,
    Boolean(acqUnitIds.length && !isMembershipsLoading && !acqUnitMemberships.length),
    acqUnitIds,
  );

  if (
    !acqUnitIds.length
    || (!isMembershipsLoading && acqUnitMemberships.length)
  ) {
    return {
      isLoading: false,
      restrictions: { protectCreate: false, protectDelete: false, protectUpdate: false },
    };
  }

  const restrictions = {
    protectCreate: acqUnits.some(unit => unit.protectCreate),
    protectDelete: acqUnits.some(unit => unit.protectDelete),
    protectUpdate: acqUnits.some(unit => unit.protectUpdate),
  };

  return {
    isLoading: isMembershipsLoading || isUnitsLoading,
    restrictions,
  };
};
