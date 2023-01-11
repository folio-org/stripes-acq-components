import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

import { REF_NUMBER_TYPE_OPTIONS } from '../../constants';
import { useVersionWrappedFormatter } from '../../VersionHistory';

const VENDOR_REF_NUMBER_COLUMNS = {
  refNumber: 'refNumber',
  refNumberType: 'refNumberType',
};

const fieldsMapping = { ...VENDOR_REF_NUMBER_COLUMNS };

const columnMapping = {
  [VENDOR_REF_NUMBER_COLUMNS.refNumber]: <FormattedMessage id="stripes-acq-components.referenceNumbers.refNumber" />,
  [VENDOR_REF_NUMBER_COLUMNS.refNumberType]: <FormattedMessage id="stripes-acq-components.referenceNumbers.refNumberType" />,
};

const visibleColumns = [
  VENDOR_REF_NUMBER_COLUMNS.refNumber,
  VENDOR_REF_NUMBER_COLUMNS.refNumberType,
];

const baseFormatter = {
  [VENDOR_REF_NUMBER_COLUMNS.refNumber]: ({ refNumber }) => refNumber,
  // eslint-disable-next-line react/prop-types
  [VENDOR_REF_NUMBER_COLUMNS.refNumberType]: ({ refNumberType: value }) => {
    const labelId = find(REF_NUMBER_TYPE_OPTIONS, { value })?.labelId;

    return labelId ? <FormattedMessage id={labelId} /> : value;
  },
};

const VendorReferenceNumbersDetails = ({ referenceNumbers, mclProps, name }) => {
  const formatter = useVersionWrappedFormatter({ baseFormatter, name, fieldsMapping });

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={referenceNumbers}
      formatter={formatter}
      id="list-item-reference-numbers"
      interactive={false}
      visibleColumns={visibleColumns}
      {...mclProps}
    />
  );
};

VendorReferenceNumbersDetails.propTypes = {
  mclProps: PropTypes.object,
  name: PropTypes.string,
  referenceNumbers: PropTypes.arrayOf(PropTypes.object),
};

VendorReferenceNumbersDetails.defaultProps = {
  mclProps: {},
  referenceNumbers: [],
};

export default VendorReferenceNumbersDetails;
