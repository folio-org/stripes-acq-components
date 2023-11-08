import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import {
  initialFilters,
  modalLabel,
  pluginVisibleColumns,
  resultsPaneTitle,
  searchableIndexes,
  visibleFilters,
} from './constants';

export const DonorsLookup = ({
  name,
  onAddDonors,
  searchLabel,
  visibleColumns,
}) => {
  const stripes = useStripes();

  return (
    <Pluggable
      id={`${name}-plugin`}
      aria-haspopup="true"
      type="find-organization"
      dataKey="organization"
      searchLabel={searchLabel}
      searchButtonStyle="default"
      disableRecordCreation
      stripes={stripes}
      selectVendor={onAddDonors}
      modalLabel={modalLabel}
      resultsPaneTitle={resultsPaneTitle}
      visibleColumns={visibleColumns}
      initialFilters={initialFilters}
      searchableIndexes={searchableIndexes}
      visibleFilters={visibleFilters}
      isMultiSelect
    >
      <span data-test-add-donor>
        <FormattedMessage id="stripes-acq-components.donors.noFindOrganizationPlugin" />
      </span>
    </Pluggable>
  );
};

DonorsLookup.propTypes = {
  onAddDonors: PropTypes.func.isRequired,
  name: PropTypes.string,
  searchLabel: PropTypes.node,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsLookup.defaultProps = {
  searchLabel: <FormattedMessage id="stripes-acq-components.donors.button.addDonor" />,
  visibleColumns: pluginVisibleColumns,
};
