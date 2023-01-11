import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  find,
  get,
} from 'lodash';

import { MultiColumnList } from '@folio/stripes/components';

import { useVersionWrappedFormatter } from '../VersionHistory/hooks';

const CONTRIBUTOR_COLUMNS = {
  contributor: 'contributor',
  contributorType: 'contributorType',
};

const fieldsMapping = {
  [CONTRIBUTOR_COLUMNS.contributor]: 'contributor',
  [CONTRIBUTOR_COLUMNS.contributorType]: 'contributorNameTypeId',
};

const columnMapping = {
  [CONTRIBUTOR_COLUMNS.contributor]: <FormattedMessage id="stripes-acq-components.label.contributor" />,
  [CONTRIBUTOR_COLUMNS.contributorType]: <FormattedMessage id="stripes-acq-components.label.contributorType" />,
};
const visibleColumns = [
  CONTRIBUTOR_COLUMNS.contributor,
  CONTRIBUTOR_COLUMNS.contributorType,
];

const ContributorDetails = ({
  contributors,
  contributorNameTypes,
  mclProps,
  name,
}) => {
  const baseFormatter = {
    [CONTRIBUTOR_COLUMNS.contributor]: ({ contributor }) => contributor,
    [CONTRIBUTOR_COLUMNS.contributorType]: ({ contributorNameTypeId: id }) => get(find(contributorNameTypes, { id }), 'name', ''),
  };

  const formatter = useVersionWrappedFormatter({ baseFormatter, name, fieldsMapping });

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
  name: PropTypes.string,
};

ContributorDetails.defaultProps = {
  contributors: [],
  contributorNameTypes: [],
  mclProps: {},
};

export default ContributorDetails;
