import find from 'lodash/find';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

const DEFAULT_IDENTIFIER_TYPES = [];
const DEFAULT_PRODUCT_IDS = [];
const DEFAULT_MCL_PROPS = {};

const ProductIdDetails = ({
  identifierTypes = DEFAULT_IDENTIFIER_TYPES,
  mclProps = DEFAULT_MCL_PROPS,
  name,
  productIds = DEFAULT_PRODUCT_IDS,
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
  mclProps: PropTypes.object,
  name: PropTypes.string,
  productIds: PropTypes.arrayOf(PropTypes.object),
};

export default ProductIdDetails;
