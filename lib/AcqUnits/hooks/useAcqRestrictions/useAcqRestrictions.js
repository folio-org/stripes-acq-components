import { useQuery } from 'react-query';
import { useStripes, useOkapiKy } from '@folio/stripes/core';

const useAcqMemberships = (entityId, acqUnits = []) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const userId = stripes.user?.user?.id;

  const searchParams = {
    limit: 1000,
    query: `userId=${userId} and (${acqUnits.map(id => `acquisitionsUnitId=${id}`).join(' or ')})`,
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

const useAcqUnits = (entityId, acqUnits = [], enabled) => {
  const ky = useOkapiKy();

  const searchParams = {
    limit: 1000,
    query: `(${acqUnits.map(id => `id=${id}`).join(' or ')})`,
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
    acqUnitIds,
    Boolean(acqUnitIds.length && !isMembershipsLoading && !acqUnitMemberships.length),
  );

  if (
    !acqUnitIds.length
    || (!isMembershipsLoading && acqUnitMemberships.length)
  ) {
    return {
      isLoading: false,
      perms: { protectCreate: false, protectDelete: false, protectUpdate: false },
    };
  }

  const perms = {
    protectCreate: acqUnits.some(unit => unit.protectCreate),
    protectDelete: acqUnits.some(unit => unit.protectDelete),
    protectUpdate: acqUnits.some(unit => unit.protectUpdate),
  };

  return {
    isLoading: isMembershipsLoading || isUnitsLoading,
    perms,
  };
};
