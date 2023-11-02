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

const AddDonorButton = ({ fetchDonors, fields, stripes, name }) => {
  const addDonors = (donors = []) => {
    const addedDonorIds = new Set(fields.value);
    const newDonorsIds = map(donors.filter(({ id }) => !addedDonorIds.has(id)), 'id');

    if (newDonorsIds.length) {
      fetchDonors([...addedDonorIds, ...newDonorsIds]);
      newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

  return (
    <Pluggable
      id={`${name}-plugin`}
      aria-haspopup="true"
      type="find-organization"
      dataKey="organization"
      searchLabel={<FormattedMessage id="stripes-acq-components.donors.button.addDonor" />}
      searchButtonStyle="default"
      disableRecordCreation
      stripes={stripes}
      selectVendor={addDonors}
      modalLabel={modalLabel}
      resultsPaneTitle={resultsPaneTitle}
      visibleColumns={pluginVisibleColumns}
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
  fetchDonors: PropTypes.func.isRequired,
  fields: PropTypes.object,
  stripes: PropTypes.object,
  name: PropTypes.string.isRequired,
};

export default AddDonorButton;
