import find from 'lodash/find';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

const DEFAULT_CONTRIBUTOR_NAME_TYPES = [];
const DEFAULT_CONTRIBUTORS = [];
const DEFAULT_MCL_PROPS = {};

const ContributorDetails = ({
  contributorNameTypes = DEFAULT_CONTRIBUTOR_NAME_TYPES,
  contributors = DEFAULT_CONTRIBUTORS,
  mclProps = DEFAULT_MCL_PROPS,
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
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
  contributors: PropTypes.arrayOf(PropTypes.object),
  mclProps: PropTypes.object,
  name: PropTypes.string,
};

export default ContributorDetails;
