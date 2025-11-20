import PropTypes from 'prop-types';

import { useIdentifierTypes } from '../hooks';
import ProductIdDetails from './ProductIdDetails';

const DEFAULT_PRODUCT_IDS = [];

const ProductIdDetailsContainer = ({
  mclProps,
  name,
  productIds = DEFAULT_PRODUCT_IDS,
  tenantId,
}) => {
  const { identifierTypes } = useIdentifierTypes({ tenantId });

  return (
    <ProductIdDetails
      identifierTypes={identifierTypes}
      productIds={productIds}
      mclProps={mclProps}
      name={name}
    />
  );
};

ProductIdDetailsContainer.propTypes = {
  mclProps: PropTypes.object,
  name: PropTypes.string,
  productIds: PropTypes.arrayOf(PropTypes.object),
  tenantId: PropTypes.string,
};

export default ProductIdDetailsContainer;
