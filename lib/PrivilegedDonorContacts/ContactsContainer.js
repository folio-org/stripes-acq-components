import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useStripes } from '@folio/stripes/core';

import { useCategories } from '../hooks';
import { acqRowFormatter } from '../utils';
import {
  defaultContainerVisibleColumns,
  defaultVisibleColumns,
} from './constants';
import { PrivilegedDonorContactsList } from './PrivilegedDonorContactsList';
import { PrivilegedDonorContactsLookup } from './PrivilegedDonorContactsLookup';
import {
  getContactsUrl,
  getResultsFormatter,
} from './utils';

export function ContactsContainer({
  columnMapping,
  columnWidths,
  contacts,
  fields,
  formatter,
  id,
  orgId,
  searchLabel,
  setContactIds,
  showTriggerButton = true,
  visibleColumns: visibleColumnsProp = defaultContainerVisibleColumns,
  ...rest
}) {
  const stripes = useStripes();
  const intl = useIntl();
  const { categories } = useCategories();
  const canAddContact = stripes.hasPerm('ui-organizations.privileged-contacts.edit');
  const isPrivilegedContactsModalEnabled = canAddContact && showTriggerButton;

  const contactsMap = useMemo(() => keyBy(contacts, 'id'), [contacts]);
  const visibleColumns = useMemo(() => {
    return canAddContact ? visibleColumnsProp : defaultVisibleColumns;
  }, [canAddContact, visibleColumnsProp]);

  const listOfDonors = useMemo(() => (fields.value || [])
    .reduce((acc, contactId, _index) => {
      const contact = contactsMap?.[contactId];

      if (contact?.id) {
        acc.push({ ...contact, _index });
      }

      return acc;
    }, []), [contactsMap, fields.value]);

  const contentData = useMemo(() => sortBy(listOfDonors, [({ lastName }) => lastName?.toLowerCase()]), [listOfDonors]);

  const resultsFormatter = useMemo(() => {
    return formatter || getResultsFormatter({
      intl,
      fields,
      categoriesDict: categories,
      canUnassignContact: isPrivilegedContactsModalEnabled,
    });
  }, [categories, fields, formatter, intl, isPrivilegedContactsModalEnabled]);

  const anchoredRowFormatter = ({ rowProps, ...restRowProps }) => {
    return acqRowFormatter({
      ...restRowProps,
      rowProps: {
        ...rowProps,
        to: getContactsUrl(orgId, restRowProps.rowData?.id),
      },
    });
  };

  const onAddContacts = (values = []) => {
    const addedDonorIds = new Set(fields.value);
    const newDonorsIds = map(values.filter(({ id: donorId }) => !addedDonorIds.has(donorId)), 'id');

    if (newDonorsIds.length) {
      setContactIds([...addedDonorIds, ...newDonorsIds]);
      newDonorsIds.forEach(contactId => fields.push(contactId));
    }
  };

  return (
    <>
      <PrivilegedDonorContactsList
        id={id}
        visibleColumns={visibleColumns}
        contentData={contentData}
        formatter={resultsFormatter}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        rowFormatter={anchoredRowFormatter}
        {...rest}
      />
      <br />
      {
        isPrivilegedContactsModalEnabled && (
          <PrivilegedDonorContactsLookup
            onAddContacts={onAddContacts}
            name={id}
            searchLabel={searchLabel}
            columnWidths={columnWidths}
            orgId={orgId}
          />
        )
      }
    </>
  );
}

ContactsContainer.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  contacts: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  orgId: PropTypes.string,
  searchLabel: PropTypes.node,
  setContactIds: PropTypes.func.isRequired,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
