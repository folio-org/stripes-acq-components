import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  find,
  get,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

import { useVersionWrappedFormatter } from '../VersionHistory';

const PRODUCT_ID_COLUMNS = {
  productId: 'productId',
  qualifier: 'qualifier',
  productIdType: 'productIdType',
};

const fieldsMapping = { ...PRODUCT_ID_COLUMNS };

const columnMapping = {
  [PRODUCT_ID_COLUMNS.productId]: <FormattedMessage id="stripes-acq-components.label.productId" />,
  [PRODUCT_ID_COLUMNS.qualifier]: <FormattedMessage id="stripes-acq-components.label.qualifier" />,
  [PRODUCT_ID_COLUMNS.productIdType]: <FormattedMessage id="stripes-acq-components.label.productIdType" />,
};
const visibleColumns = [
  PRODUCT_ID_COLUMNS.productId,
  PRODUCT_ID_COLUMNS.qualifier,
  PRODUCT_ID_COLUMNS.productIdType,
];

const ProductIdDetails = ({
  productIds,
  identifierTypes,
  mclProps,
  name,
}) => {
  const baseFormatter = {
    [PRODUCT_ID_COLUMNS.productId]: ({ productId }) => productId,
    [PRODUCT_ID_COLUMNS.qualifier]: ({ qualifier }) => qualifier,
    [PRODUCT_ID_COLUMNS.productIdType]: ({ productIdType }) => get(find(identifierTypes, { id: productIdType }), 'name', ''),
  };

  const formatter = useVersionWrappedFormatter({ baseFormatter, name, fieldsMapping });

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={productIds}
      formatter={formatter}
      id="list-product-ids"
      interactive={false}
      visibleColumns={visibleColumns}
      {...mclProps}
    />
  );
};

ProductIdDetails.propTypes = {
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  productIds: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
  name: PropTypes.string,
};

ProductIdDetails.defaultProps = {
  identifierTypes: [],
  productIds: [],
  mclProps: {},
};

export default ProductIdDetails;
