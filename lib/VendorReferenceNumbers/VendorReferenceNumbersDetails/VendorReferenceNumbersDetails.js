import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { find } from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

import { REF_NUMBER_TYPE_OPTIONS } from '../../constants';

const columnMapping = {
  refNumber: <FormattedMessage id="stripes-acq-components.referenceNumbers.refNumber" />,
  refNumberType: <FormattedMessage id="stripes-acq-components.referenceNumbers.refNumberType" />,
};
const visibleColumns = ['refNumber', 'refNumberType'];
const formatter = {
  // eslint-disable-next-line react/prop-types
  refNumberType: ({ refNumberType: value }) => {
    const labelId = find(REF_NUMBER_TYPE_OPTIONS, { value })?.labelId;

    return labelId ? <FormattedMessage id={labelId} /> : value;
  },
};

const VendorReferenceNumbersDetails = ({ referenceNumbers, mclProps }) => {
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
  referenceNumbers: PropTypes.arrayOf(PropTypes.object),
};

VendorReferenceNumbersDetails.defaultProps = {
  mclProps: {},
  referenceNumbers: [],
};

export default VendorReferenceNumbersDetails;
