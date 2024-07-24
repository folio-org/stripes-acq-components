import { FormattedMessage } from 'react-intl';

import { TextLink } from '@folio/stripes/components';

export const ROUTING_LIST_ACCORDION_ID = 'routing-list';
export const DEFAULT_ROUTING_LIST_URL = '/orders/routing-lists';

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

export const getRoutingListFormatter = (routingListUrl = DEFAULT_ROUTING_LIST_URL, returnUrl) => ({
  name: record => (
    <TextLink to={`${routingListUrl}/view/${record.id}?returnUrl=${returnUrl}`}>
      {record.name}
    </TextLink>
  ),
  notes: record => record.notes,
  userIds: record => record.userIds?.join(', '),
});

export const columnWidths = {
  userIds: '40%',
};
