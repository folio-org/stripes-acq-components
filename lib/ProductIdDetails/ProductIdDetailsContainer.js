import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { DICT_IDENTIFIER_TYPES } from '../constants';
import { identifierTypesManifest } from '../manifests';
import ProductIdDetails from './ProductIdDetails';

const ProductIdDetailsContainer = ({
  resources,
  productIds,
  mclProps,
  name,
}) => {
  const identifierTypes = get(resources, [DICT_IDENTIFIER_TYPES, 'records'], []);

  return (
    <ProductIdDetails
      identifierTypes={identifierTypes}
      productIds={productIds}
      mclProps={mclProps}
      name={name}
    />
  );
};

ProductIdDetailsContainer.manifest = Object.freeze({
  [DICT_IDENTIFIER_TYPES]: identifierTypesManifest,
});

ProductIdDetailsContainer.propTypes = {
  resources: PropTypes.object.isRequired,
  productIds: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
  name: PropTypes.string,
};

ProductIdDetailsContainer.defaultProps = {
  productIds: [],
};

export default stripesConnect(ProductIdDetailsContainer);
