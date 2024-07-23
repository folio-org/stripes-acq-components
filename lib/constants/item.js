import React from 'react';
import { FormattedMessage } from 'react-intl';

export const ITEM_STATUS = {
  inProcess: 'In process',
  onOrder: 'On order',
  available: 'Available',
  inTransit: 'In transit',
  orderClosed: 'Order closed',
  undefined: 'Undefined',
  unavailable: 'Unavailable',
};

export const getItemStatusLabel = (itemStatus) => {
  return itemStatus
    ? (
      <FormattedMessage
        id={`stripes-acq-components.receiving.itemStatus.${itemStatus}`}
        defaultMessage={itemStatus}
      />
    )
    : '';
};
