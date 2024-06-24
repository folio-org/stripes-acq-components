import PropTypes from 'prop-types';
import { useState } from 'react';

import { useMaterialTypes } from '../hooks';
import MaterialTypeFilter from './MaterialTypeFilter';

const MaterialTypeFilterContainer = ({ tenantId, ...rest }) => {
  const [materialTypeOptions, setMaterialTypeOptions] = useState([]);

  useMaterialTypes({
    tenantId,
    onSuccess: ({ mtypes }) => {
      setMaterialTypeOptions(
        mtypes.map(materialType => ({
          value: materialType.id,
          label: materialType.name,
        })),
      );
    },
  });

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
