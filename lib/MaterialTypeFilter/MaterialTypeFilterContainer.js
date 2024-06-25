import PropTypes from 'prop-types';
import { useMemo } from 'react';

import { useMaterialTypes } from '../hooks';
import MaterialTypeFilter from './MaterialTypeFilter';

const MaterialTypeFilterContainer = ({ tenantId, ...rest }) => {
  const { materialTypes } = useMaterialTypes({ tenantId });

  const materialTypeOptions = useMemo(() => {
    return materialTypes.map(materialType => ({
      value: materialType.id,
      label: materialType.name,
    }));
  }, [materialTypes]);

  return (
    <MaterialTypeFilter
      {...rest}
      options={materialTypeOptions}
    />
  );
};

MaterialTypeFilterContainer.propTypes = {
  tenantId: PropTypes.string,
};

export default MaterialTypeFilterContainer;
