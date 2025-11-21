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
  sortableColumns,
  visibleFilters,
} from './constants';

export const DonorsLookup = ({
  columnWidths,
  isMultiSelect = true,
  name,
  onAddDonors,
  searchButtonStyle = 'default',
  searchLabel = <FormattedMessage id="stripes-acq-components.donors.button.addDonor" />,
  visibleColumns = pluginVisibleColumns,
}) => {
  const stripes = useStripes();

  return (
    <Pluggable
      id={`${name}-plugin`}
      aria-haspopup="true"
      type="find-organization"
      dataKey="organization"
      searchLabel={searchLabel}
      searchButtonStyle={searchButtonStyle}
      disableRecordCreation
      stripes={stripes}
      selectVendor={onAddDonors}
      modalLabel={modalLabel}
      resultsPaneTitle={resultsPaneTitle}
      visibleColumns={visibleColumns}
      initialFilters={initialFilters}
      searchableIndexes={searchableIndexes}
      visibleFilters={visibleFilters}
      isMultiSelect={isMultiSelect}
      sortableColumns={sortableColumns}
      columnWidths={columnWidths}
    >
      <span data-test-add-donor>
        <FormattedMessage id="stripes-acq-components.donors.noFindOrganizationPlugin" />
      </span>
    </Pluggable>
  );
};

DonorsLookup.propTypes = {
  columnWidths: PropTypes.object,
  isMultiSelect: PropTypes.bool,
  name: PropTypes.string,
  onAddDonors: PropTypes.func.isRequired,
  searchButtonStyle: PropTypes.string,
  searchLabel: PropTypes.node,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
