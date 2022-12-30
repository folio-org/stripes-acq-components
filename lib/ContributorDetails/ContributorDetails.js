import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  find,
  get,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

const columnMapping = {
  contributor: <FormattedMessage id="stripes-acq-components.label.contributor" />,
  contributorType: <FormattedMessage id="stripes-acq-components.label.contributorType" />,
};
const visibleColumns = ['contributor', 'contributorType'];

const ContributorDetails = ({
  contributors,
  contributorNameTypes,
  mclProps,
}) => {
  const formatter = { contributorType: ({ contributorNameTypeId: id }) => get(find(contributorNameTypes, { id }), 'name', '') };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={contributors}
      formatter={formatter}
      id="list-item-contributors"
      interactive={false}
      visibleColumns={visibleColumns}
      {...mclProps}
    />
  );
};

ContributorDetails.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
};

ContributorDetails.defaultProps = {
  contributors: [],
  contributorNameTypes: [],
  mclProps: {},
};

export default ContributorDetails;
