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

import {
  alignRowProps,
  defaultColumnMapping,
  defaultColumnWidths,
  defaultVisibleColumns,
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

const DonorsList = ({
  columnMapping,
  columnWidths,
  donorsMap,
  fields,
  formatter,
  id,
  stripes,
  visibleColumns,
}) => {
  const intl = useIntl();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');

  const donors = useMemo(() => (fields.value || [])
    .map((contactId, _index) => {
      const contact = donorsMap?.[contactId];

      return {
        ...(contact || { isDeleted: true }),
        _index,
      };
    }), [donorsMap, fields.value]);

  const contentData = useMemo(() => sortBy(donors, [({ lastName }) => lastName?.toLowerCase()]), [donors]);

  const resultsFormatter = useMemo(() => {
    return getResultsFormatter({ intl, fields, canViewOrganizations });
  }, [canViewOrganizations, fields, intl]);

  return (
    <MultiColumnList
      id={id}
      columnMapping={columnMapping}
      contentData={contentData}
      formatter={formatter || resultsFormatter}
      rowProps={alignRowProps}
      visibleColumns={visibleColumns}
      columnWidths={columnWidths}
    />
  );
};

DonorsList.propTypes = {
  fields: PropTypes.object,
  donorsMap: PropTypes.object,
  id: PropTypes.string.isRequired,
  stripes: PropTypes.object,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
  formatter: PropTypes.object,
  columnWidths: PropTypes.object,
  columnMapping: PropTypes.object,
};

DonorsList.defaultProps = {
  columnMapping: defaultColumnMapping,
  columnWidths: defaultColumnWidths,
  visibleColumns: defaultVisibleColumns,
};

export default DonorsList;
