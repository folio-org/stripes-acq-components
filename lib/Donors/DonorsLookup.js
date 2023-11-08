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

const DonorsLookup = ({
  name,
  onAddDonors,
  searchLabel,
  showTriggerButton,
  visibleColumns,
}) => {
  const stripes = useStripes();

  if (!showTriggerButton) {
    return null;
  }

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
  showTriggerButton: PropTypes.bool,
  searchLabel: PropTypes.node,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsLookup.defaultProps = {
  showTriggerButton: true,
  searchLabel: <FormattedMessage id="stripes-acq-components.donors.button.addDonor" />,
  visibleColumns: pluginVisibleColumns,
};

export default DonorsLookup;
