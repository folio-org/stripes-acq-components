import React, { useMemo } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Button,
  Icon,
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import AddDonorButton from './AddDonorButton';
import {
  alignRowProps,
  columnMapping,
  columnWidths,
  visibleColumns,
} from './constants';

const getDonorUrl = (orgId) => {
  if (orgId) {
    return `/organizations/view/${orgId}`;
  }

  return undefined;
};

const getResultsFormatter = ({
  canViewOrganizations,
  fields,
  intl,
}) => ({
  name: donor => <TextLink to={getDonorUrl(canViewOrganizations && donor.id)}>{donor.name}</TextLink>,
  code: donor => donor.code,
  unassignDonor: donor => (
    <Button
      align="end"
      aria-label={intl.formatMessage({ id: 'stripes-acq-components.donors.button.unassign' })}
      buttonStyle="fieldControl"
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

  const resultsFormatter = useMemo(() => {
    return getResultsFormatter({ intl, fields, canViewOrganizations });
  }, [canViewOrganizations, fields, intl]);

  return (
    <>
      <MultiColumnList
        id={id}
        columnMapping={columnMapping}
        contentData={contentData}
        formatter={resultsFormatter}
        rowProps={alignRowProps}
        visibleColumns={visibleColumns}
        columnWidths={columnWidths}
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
