import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  find,
  get,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

const columnMapping = {
  productId: <FormattedMessage id="stripes-acq-components.label.productId" />,
  qualifier: <FormattedMessage id="stripes-acq-components.label.qualifier" />,
  productIdType: <FormattedMessage id="stripes-acq-components.label.productIdType" />,
};
const visibleColumns = ['productId', 'qualifier', 'productIdType'];

const ProductIdDetails = ({ productIds, identifierTypes }) => {
  const formatter = { productIdType: ({ productIdType }) => get(find(identifierTypes, { id: productIdType }), 'name', '') };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={productIds}
      formatter={formatter}
      id="list-product-ids"
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

ProductIdDetails.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  productIds: PropTypes.arrayOf(PropTypes.object),
};

ProductIdDetails.defaultProps = {
  identifierTypes: [],
  productIds: [],
};

export default ProductIdDetails;
