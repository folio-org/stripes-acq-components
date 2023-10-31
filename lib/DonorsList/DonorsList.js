import React, { useMemo } from 'react';
import {
  map,
  sortBy,
} from 'lodash';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import {
  Pluggable,
  useStripes,
} from '@folio/stripes/core';

import { acqRowFormatter } from '../utils';

const columnMapping = {
  name: <FormattedMessage id="stripes-acq-components.donors.column.name" />,
  code: <FormattedMessage id="stripes-acq-components.donors.column.code" />,
  unassignDonor: null,
};

const visibleColumns = [
  'name',
  'code',
  'unassignDonor',
];

const getResultsFormatter = ({
  intl,
  fields,
}) => ({
  name: donor => donor.name,
  code: donor => donor.code,
  unassignDonor: (donor) => (
    <Button
      align="end"
      aria-label={intl.formatMessage({ id: 'stripes-acq-components.donors.button.unassign' })}
      buttonStyle="fieldControl"
      data-test-unassign-donor
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fields.remove(donor._index);
      }}
    >
      <Icon icon="times-circle" />
    </Button>
  ),
});

const getDonorUrl = (orgId) => {
  if (orgId) {
    return `/organizations/view/${orgId}`;
  }

  return undefined;
};

const AddDonorButton = ({ fetchDonors, fields, stripes, name }) => {
  const addDonors = (contacts = []) => {
    const addedContactIds = new Set(fields.value);
    const newContactsIds = map(contacts.filter(({ id }) => !addedContactIds.has(id)), 'id');

    if (newContactsIds.length) {
      fetchDonors([...addedContactIds, ...newContactsIds]);
      newContactsIds.forEach(contactId => fields.push(contactId));
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
      isDonorsEnabled
    >
      <span data-test-add-donor>
        <FormattedMessage id="stripes-acq-components.donors.noFindDonorPlugin" />
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

const alignRowProps = { alignLastColToEnd: true };

const DonorsList = ({ fetchDonors, fields, donorsMap, id }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');
  const donors = (fields.value || [])
    .map((contactId, _index) => {
      const contact = donorsMap?.[contactId];

      return {
        ...(contact || { isDeleted: true }),
        _index,
      };
    });
  const contentData = sortBy(donors, [({ lastName }) => lastName?.toLowerCase()]);

  const anchoredRowFormatter = ({ rowProps, ...rest }) => {
    return acqRowFormatter({
      ...rest,
      rowProps: {
        ...rowProps,
        to: getDonorUrl(canViewOrganizations && rest.rowData.id),
      },
    });
  };

  const resultsFormatter = useMemo(() => {
    return getResultsFormatter({ intl, fields });
  }, [fields, intl]);

  return (
    <>
      <MultiColumnList
        id={id}
        columnMapping={columnMapping}
        contentData={contentData}
        formatter={resultsFormatter}
        rowFormatter={anchoredRowFormatter}
        rowProps={alignRowProps}
        visibleColumns={visibleColumns}
      />
      <br />
      <AddDonorButton
        fetchDonors={fetchDonors}
        fields={fields}
        stripes={stripes}
        name={id}
      />
    </>
  );
};

DonorsList.propTypes = {
  fetchDonors: PropTypes.func.isRequired,
  fields: PropTypes.object,
  donorsMap: PropTypes.object,
  id: PropTypes.string.isRequired,
};

export default DonorsList;
