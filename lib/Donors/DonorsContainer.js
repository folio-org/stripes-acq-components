import {
  keyBy,
  map,
  noop,
  sortBy,
} from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { IfVisible } from '../VisibilityControl';
import { defaultContainerVisibleColumns } from './constants';
import { DonorsList } from './DonorsList';
import { DonorsLookup } from './DonorsLookup';
import { getDonorsFormatter } from './utils';

export function DonorsContainer({
  columnMapping,
  columnWidths: columnWidthsProp,
  donors,
  fields,
  formatter,
  hiddenFields,
  id,
  onRemove,
  setDonorIds,
  searchLabel,
  showTriggerButton,
  visibleColumns,
  ...rest
}) {
  const stripes = useStripes();
  const intl = useIntl();
  const canViewOrganizations = stripes.hasPerm('ui-organizations.view');

  const donorsMap = useMemo(() => keyBy(donors, 'id'), [donors]);

  const listOfDonors = useMemo(() => (fields.value || [])
    .reduce((acc, contactId, _index) => {
      const contact = donorsMap?.[contactId];

      if (contact?.id) {
        acc.push({ ...contact, _index });
      }

      return acc;
    }, []), [donorsMap, fields.value]);

  const contentData = useMemo(() => sortBy(listOfDonors, [({ name }) => name?.toLowerCase()]), [listOfDonors]);

  const resultsFormatter = useMemo(() => {
    return formatter || getDonorsFormatter({ intl, fields, canViewOrganizations, onRemove });
  }, [canViewOrganizations, fields, formatter, intl, onRemove]);

  const onAddDonors = (values = []) => {
    const addedDonorIds = new Set(fields.value);
    const newDonorsIds = map(values.filter(({ id: donorId }) => !addedDonorIds.has(donorId)), 'id');

    if (newDonorsIds.length) {
      setDonorIds([...addedDonorIds, ...newDonorsIds]);
      newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

  const columnWidths = useMemo(() => {
    return columnWidthsProp || {
      name: { min: 200, max: '50%' },
      code: { min: 100, max: '40%' },
      unassignDonor: '10%',
    };
  }, [columnWidthsProp]);

  return (
    <IfVisible visible={!hiddenFields.donorsInformation}>
      <DonorsList
        id={id}
        visibleColumns={visibleColumns}
        contentData={contentData}
        formatter={resultsFormatter}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        {...rest}
      />
      <br />
      {
        showTriggerButton && (
          <DonorsLookup
            onAddDonors={onAddDonors}
            name={id}
            searchLabel={searchLabel}
            columnWidths={columnWidths}
          />
        )
      }
    </IfVisible>
  );
}

DonorsContainer.propTypes = {
  hiddenFields: PropTypes.object,
  columnWidths: PropTypes.object,
  columnMapping: PropTypes.object,
  donors: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  onRemove: PropTypes.func,
  searchLabel: PropTypes.node,
  setDonorIds: PropTypes.func.isRequired,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

DonorsContainer.defaultProps = {
  hiddenFields: {},
  onRemove: noop,
  showTriggerButton: true,
  visibleColumns: defaultContainerVisibleColumns,
};
