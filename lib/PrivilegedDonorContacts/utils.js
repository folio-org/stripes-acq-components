import { map } from 'lodash';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import { PRIVILEGED_CONTACT_URL } from './constants';

export const transformCategoryIdsToLabels = (categories, categoryIds = []) => {
  const categoriesMap = (categories || []).reduce((acc, category) => {
    acc[category.id] = category.value;

    return acc;
  }, {});

  return categoryIds.map(categoryId => categoriesMap[categoryId] || '').join(', ');
};

export const getResultsFormatter = ({
  intl,
  fields,
  categoriesDict,
}) => ({
  categories: ({ categories = [] }) => transformCategoryIdsToLabels(categoriesDict, categories),
  email: ({ emails }) => map(emails, 'value').join(', '),
  name: contact => `${contact.lastName}, ${contact.firstName}`,
  notes: (contact) => contact.notes,
  phone: ({ phoneNumbers }) => map(phoneNumbers, 'value').join(', '),
  status: ({ inactive }) => intl.formatMessage({
    id: `stripes-acq-components.privilegedContacts.status.${inactive ? 'inactive' : 'active'}`,
  }),
  unassignContact: (contact) => (
    <Button
      align="end"
      aria-label={intl.formatMessage({ id: 'stripes-acq-components.privilegedContacts.button.unassign' })}
      buttonStyle="fieldControl"
      data-test-unassign-contact
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fields.remove(contact._index);
      }}
    >
      <Icon icon="times-circle" />
    </Button>
  ),
});

export const getContactsUrl = (orgId, contactId) => {
  if (!contactId) return undefined;

  const ending = contactId ? `/${PRIVILEGED_CONTACT_URL}/${contactId}/view` : `/${PRIVILEGED_CONTACT_URL}/add-contact`;
  const starting = orgId ? `/organizations/${orgId}` : '/organizations';

  return `${starting}${ending}`;
};
