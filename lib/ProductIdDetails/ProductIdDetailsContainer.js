import PropTypes from 'prop-types';

import { useIdentifierTypes } from '../hooks';
import ProductIdDetails from './ProductIdDetails';

const ProductIdDetailsContainer = ({
  productIds,
  mclProps,
  name,
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
  productIds: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
  name: PropTypes.string,
  tenantId: PropTypes.string,
};

ProductIdDetailsContainer.defaultProps = {
  productIds: [],
};

export default ProductIdDetailsContainer;
