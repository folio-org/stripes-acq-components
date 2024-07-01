import PropTypes from 'prop-types';

import { LIMIT_MAX } from '../../constants';
import { useAcquisitionUnits } from '../../hooks';

import AcqUnitsView from './AcqUnitsView';

const AcqUnitsViewContainer = ({ tenantId, units }) => {
  const { acquisitionsUnits } = useAcquisitionUnits({
    tenantId,
    searchParams: {
      query: `((isDeleted==false or isDeleted==true) and (${units.map(unit => `id==${unit}`).join(' or ')}))`,
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
