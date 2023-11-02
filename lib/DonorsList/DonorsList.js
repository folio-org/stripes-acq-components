import React, { useMemo } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Button,
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';

import { acqRowFormatter } from '../utils';
import AddDonorButton from './AddDonorButton';
import { alignRowProps, columnMapping, columnWidths, visibleColumns } from './constants';

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
