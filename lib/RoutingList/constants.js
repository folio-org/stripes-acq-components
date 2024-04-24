import { FormattedMessage } from 'react-intl';

import { TextLink } from '@folio/stripes/components';

import { ROUTING_LIST_API } from '../constants';

export const CREATE_ROUTING_LIST_URL = `/${ROUTING_LIST_API}/create`;
export const ROUTING_LIST_ACCORDION_ID = 'routing-list';

const COLUMN_NAMES = {
  name: 'name',
  notes: 'notes',
  userIds: 'userIds',
};

export const columnMapping = {
  name: <FormattedMessage id="stripes-acq-components.routing.list.column.name" />,
  notes: <FormattedMessage id="stripes-acq-components.routing.list.column.notes" />,
  userIds: <FormattedMessage id="stripes-acq-components.routing.list.column.userIds" />,
};

export const visibleColumns = [
  COLUMN_NAMES.name,
  COLUMN_NAMES.notes,
  COLUMN_NAMES.userIds,
];

export const alignRowProps = { alignLastColToEnd: false };

export const routingListFormatter = {
  name: record => <TextLink to={`/${ROUTING_LIST_API}/view/${record.id}`}>{record.name}</TextLink>,
  notes: record => record.notes,
  userIds: record => record.userIds?.join(', '),
};
