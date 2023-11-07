import { map } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pluggable } from '@folio/stripes/core';

import {
  initialFilters,
  modalLabel,
  pluginVisibleColumns,
  resultsPaneTitle,
  searchableIndexes,
  visibleFilters,
} from './constants';

const AddDonorButton = ({
  fields,
  name,
  onAddDonors,
  searchLabel,
  showTriggerButton,
  stripes,
  visibleColumns,
}) => {
  const addDonors = (donors = []) => {
    const addedDonorIds = new Set(fields.value);
    const newDonorsIds = map(donors.filter(({ id }) => !addedDonorIds.has(id)), 'id');

    if (newDonorsIds.length) {
      onAddDonors([...addedDonorIds, ...newDonorsIds]);
      newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

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
      selectVendor={addDonors}
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

AddDonorButton.propTypes = {
  onAddDonors: PropTypes.func.isRequired,
  fields: PropTypes.object,
  stripes: PropTypes.object,
  name: PropTypes.string.isRequired,
  showTriggerButton: PropTypes.bool,
  searchLabel: PropTypes.node,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

AddDonorButton.defaultProps = {
  showTriggerButton: true,
  searchLabel: <FormattedMessage id="stripes-acq-components.donors.button.addDonor" />,
  visibleColumns: pluginVisibleColumns,
};
export default AddDonorButton;
