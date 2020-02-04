import React from 'react';
import { FormattedMessage } from 'react-intl';

export const ORDER_STATUSES = {
  closed: 'Closed',
  open: 'Open',
  pending: 'Pending',
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUSES).map(status => ({
  value: ORDER_STATUSES[status],
  label: <FormattedMessage id={`stripes-acq-components.order.status.${status}`} />,
}));

export const ORDER_TYPES = {
  oneTime: 'One-Time',
  ongoing: 'Ongoing',
};

export const ORDER_TYPE_OPTIONS = Object.keys(ORDER_TYPES).map(type => ({
  value: ORDER_TYPES[type],
  label: <FormattedMessage id={`stripes-acq-components.order.type.${type}`} />,
}));

export const ORDER_FORMATS = {
  electronicResource: 'Electronic Resource',
  physicalResource: 'Physical Resource',
  PEMix: 'P/E Mix',
  other: 'Other',
};

export const ORDER_FORMAT_OPTIONS = Object.keys(ORDER_FORMATS).map(format => ({
  value: ORDER_FORMATS[format],
  label: <FormattedMessage id={`stripes-acq-components.order.format.${format}`} />,
}));

export const DISCOUNT_TYPE = {
  amount: 'amount',
  percentage: 'percentage',
};
