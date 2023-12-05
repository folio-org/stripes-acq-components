import { map, sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { acqRowFormatter } from '../utils';
import { defaultContainerVisibleColumns } from './constants';
import { useCategories } from './hooks';
import { PrivilegedDonorContactsList } from './PrivilegedDonorContactsList';
import { PrivilegedDonorContactsLookup } from './PrivilegedDonorContactsLookup';
import {
  getContactsUrl,
  getResultsFormatter,
} from './utils';

export function PrivilegedDonorContactsContainer({
  columnMapping,
  columnWidths,
  contacts,
  fields,
  formatter,
  id,
  orgId,
  setContactIds,
  searchLabel,
  selectedContactIds,
  showTriggerButton,
  visibleColumns,
  ...rest
}) {
  const intl = useIntl();
  const { categories } = useCategories();

  const contactsMap = useMemo(() => {
    return contacts.reduce((acc, contact) => {
      acc[contact.id] = contact;

      return acc;
    }, {});
  }, [contacts]);

  const listOfDonors = useMemo(() => (fields.value || [])
    .map((contactId, _index) => {
      const contact = contactsMap?.[contactId];

      return {
        ...(contact || { isDeleted: true }),
        _index,
      };
    }), [contactsMap, fields.value]);

  const contentData = useMemo(() => sortBy(listOfDonors, [({ lastName }) => lastName?.toLowerCase()]), [listOfDonors]);

  const resultsFormatter = useMemo(() => {
    return formatter || getResultsFormatter({ intl, fields, categoriesDict: categories });
  }, [categories, fields, formatter, intl]);

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
        showTriggerButton && (
          <PrivilegedDonorContactsLookup
            onAddContacts={onAddContacts}
            name={id}
            searchLabel={searchLabel}
            columnWidths={columnWidths}
            orgId={orgId}
            selectedContactIds={selectedContactIds}
          />
        )
      }
    </>
  );
}

PrivilegedDonorContactsContainer.propTypes = {
  columnMapping: PropTypes.object,
  columnWidths: PropTypes.object,
  contacts: PropTypes.arrayOf(PropTypes.object),
  fields: PropTypes.object,
  formatter: PropTypes.object,
  id: PropTypes.string,
  orgId: PropTypes.string,
  searchLabel: PropTypes.node,
  selectedContactIds: PropTypes.arrayOf(PropTypes.string),
  setContactIds: PropTypes.func.isRequired,
  showTriggerButton: PropTypes.bool,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};

PrivilegedDonorContactsContainer.defaultProps = {
  showTriggerButton: true,
  visibleColumns: defaultContainerVisibleColumns,
};
