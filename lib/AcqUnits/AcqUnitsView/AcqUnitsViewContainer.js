import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { LIMIT_MAX } from '../../constants';
import { useAcquisitionUnits } from '../../hooks';

import AcqUnitsView from './AcqUnitsView';

const AcqUnitsViewContainer = ({ tenantId, units }) => {
  const joinedUnitIds = useMemo(() => units.map(unit => `id==${unit}`).join(' or '), [units]);

  const { acquisitionsUnits } = useAcquisitionUnits({
    tenantId,
    searchParams: {
      query: `((isDeleted==false or isDeleted==true) and (${joinedUnitIds}))`,
      limit: LIMIT_MAX,
    },
    enabled: Boolean(units.length),
  });

  return (
    <AcqUnitsView units={acquisitionsUnits} />
  );
};

AcqUnitsViewContainer.propTypes = {
  tenantId: PropTypes.string,
  units: PropTypes.arrayOf(PropTypes.string),
};

AcqUnitsViewContainer.defaultProps = {
  units: [],
};

export default AcqUnitsViewContainer;
