import compact from 'lodash/compact';
import difference from 'lodash/difference';
import uniq from 'lodash/uniq';
import PropTypes from 'prop-types';

import { useStripes } from '@folio/stripes/core';

import { useAcquisitionUnits } from '../../hooks';
import { useAcqUnitsMemberships } from '../hooks';
import AcqUnitsField from './AcqUnitsField';

export const buildAcqUnitsQuery = (memberUnits, preselectedUnits, isEdit) => {
  const uniqMemberUnits = uniq(difference(memberUnits, preselectedUnits)).map(unitId => `id==${unitId}`).join(' or ');
  const uniqPreselectedUnits = uniq(preselectedUnits).map(unitId => `id==${unitId}`).join(' or ');

  const memberUnitsQuery = uniqMemberUnits.length
    ? `(${uniqMemberUnits})`
    : '';
  const preselectedUnitsQuery = uniqPreselectedUnits.length
    ? `((${uniqPreselectedUnits}) and (isDeleted==false or isDeleted==true))`
    : '';

  return compact([
    isEdit ? undefined : 'protectCreate==false',
    memberUnitsQuery,
    preselectedUnitsQuery,
  ]).join(' or ');
};

const AcqUnitsFieldContainer = ({
  name,
  preselectedUnits,
  perm,
  isEdit,
  isFinal,
  id,
  tenantId,
}) => {
  const stripes = useStripes();
  const userId = stripes?.user?.user?.id;

  const { acquisitionsUnitMemberships } = useAcqUnitsMemberships(userId, { tenantId });

  const { acquisitionsUnits } = useAcquisitionUnits({
    tenantId,
    searchParams: {
      query: buildAcqUnitsQuery(
        acquisitionsUnitMemberships.map(({ acquisitionsUnitId }) => acquisitionsUnitId),
        preselectedUnits,
        isEdit,
      ),
    },
  });

  return (
    <AcqUnitsField
      id={id}
      name={name}
      units={acquisitionsUnits}
      disabled={perm ? !stripes.hasPerm(perm) : false}
      isFinal={isFinal}
    />
  );
};

AcqUnitsFieldContainer.propTypes = {
  name: PropTypes.string,
  perm: PropTypes.string,
  preselectedUnits: PropTypes.arrayOf(PropTypes.string),
  id: PropTypes.string,
  isEdit: PropTypes.bool,
  isFinal: PropTypes.bool,
  tenantId: PropTypes.string,
};

AcqUnitsFieldContainer.defaultProps = {
  name: 'acqUnitIds',
  preselectedUnits: [],
  perm: '',
  isEdit: false,
  isFinal: false,
};

export default AcqUnitsFieldContainer;
