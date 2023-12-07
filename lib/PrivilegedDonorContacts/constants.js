import { FormattedMessage } from 'react-intl';

export const PRIVILEGED_CONTACT_URL = 'privileged-contacts';

const COLUMN_NAMES = {
  categories: 'categories',
  email: 'email',
  name: 'name',
  notes: 'notes',
  phone: 'phone',
  status: 'status',
  unassignContact: 'unassignContact',
};

const {
  categories,
  email,
  name,
  notes,
  phone,
  status,
  unassignContact,
} = COLUMN_NAMES;

export const defaultVisibleColumns = [
  name,
  categories,
  email,
  phone,
  status,
  notes,
];

export const defaultColumnMapping = {
  [categories]: <FormattedMessage id="stripes-acq-components.privilegedContacts.categories" />,
  [email]: <FormattedMessage id="stripes-acq-components.privilegedContacts.email" />,
  [name]: <FormattedMessage id="stripes-acq-components.privilegedContacts.name" />,
  [notes]: <FormattedMessage id="stripes-acq-components.privilegedContacts.note" />,
  [phone]: <FormattedMessage id="stripes-acq-components.privilegedContacts.phone" />,
  [status]: <FormattedMessage id="stripes-acq-components.privilegedContacts.status" />,
  [unassignContact]: null,
};

export const sortableColumns = defaultVisibleColumns;

export const defaultContainerVisibleColumns = [
  ...defaultVisibleColumns,
  unassignContact,
];

export const alignRowProps = { alignLastColToEnd: true };
