import { map, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { defaultVisibleColumns } from './constants';
import DonorsList from './DonorsList';
import DonorsLookup from './DonorsLookup';
import { getResultsFormatter } from './utils';

function DonorsContainer({
  columnMapping,
  columnWidths,
  donors,
  fields,
  formatter,
  id,
  setDonorIds,
  searchLabel,
  showTriggerButton,
  visibleColumns,
}) {
  const stripes = useStripes();
  const intl = useIntl();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');

  const donorsMap = donors.reduce((acc, contact) => {
    acc[contact.id] = contact;

    return acc;
  }, {});

  const listOfDonors = useMemo(() => (fields.value || [])
    .map((contactId, _index) => {
      const contact = donorsMap?.[contactId];

      return {
        ...(contact || { isDeleted: true }),
        _index,
      };
    }), [donorsMap, fields.value]);

  const contentData = useMemo(() => sortBy(listOfDonors, [({ lastName }) => lastName?.toLowerCase()]), [listOfDonors]);

  const resultsFormatter = useMemo(() => {
    return formatter || getResultsFormatter({ intl, fields, canViewOrganizations });
  }, [canViewOrganizations, fields, formatter, intl]);

  const onAddDonors = (values = []) => {
    const addedDonorIds = new Set(fields.value);
    const newDonorsIds = map(values.filter(({ id: donorId }) => !addedDonorIds.has(donorId)), 'id');

    if (newDonorsIds.length) {
      setDonorIds([...addedDonorIds, ...newDonorsIds]);
      newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

  return (
    <>
      <DonorsList
        id={id}
        visibleColumns={visibleColumns}
        contentData={contentData}
        formatter={resultsFormatter}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
      />
      <br />
      {
        showTriggerButton && (
          <DonorsLookup
            onAddDonors={onAddDonors}
            name={id}
            searchLabel={searchLabel}
            showTriggerButton={showTriggerButton}
            visibleColumns={visibleColumns}
          />
        )
      }
    </>
  );
}

DonorsContainer.propTypes = {
  columnWidths: PropTypes.object,
  columnMapping: PropTypes.object,
  donors: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  searchLabel: PropTypes.node,
  setDonorIds: PropTypes.func.isRequired,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsContainer.defaultProps = {
  showTriggerButton: true,
  visibleColumns: defaultVisibleColumns,
};

export default DonorsContainer;
