import PropTypes from 'prop-types';

import { useAcquisitionUnits } from '../hooks';
import AcqUnitFilter from './AcqUnitFilter';

const AcqUnitFilterContainer = ({ tenantId, ...rest }) => {
  const { acquisitionsUnits } = useAcquisitionUnits({ tenantId });

  return (
    <AcqUnitFilter
      labelId="stripes-acq-components.filter.acqUnit"
      {...rest}
      acqUnits={acquisitionsUnits}
    />
  );
};

AcqUnitFilterContainer.propTypes = {
  tenantId: PropTypes.string,
};

export default AcqUnitFilterContainer;
