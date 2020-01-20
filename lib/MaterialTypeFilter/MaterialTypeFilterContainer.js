import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import {
  materialTypesManifest,
} from '../manifests';

import MaterialTypeFilter from './MaterialTypeFilter';

const MaterialTypeFilterContainer = ({ mutator, ...rest }) => {
  const [materialTypeOptions, setMaterialTypeOptions] = useState([]);

  useEffect(
    () => {
      mutator.materialTypeFilterMaterials.GET()
        .then(materialTypes => {
          setMaterialTypeOptions(
            materialTypes.map(materialType => ({
              value: materialType.id,
              label: materialType.name,
            })),
          );
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <MaterialTypeFilter
      {...rest}
      options={materialTypeOptions}
    />
  );
};

MaterialTypeFilterContainer.manifest = Object.freeze({
  materialTypeFilterMaterials: materialTypesManifest,
});

MaterialTypeFilterContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(MaterialTypeFilterContainer);
