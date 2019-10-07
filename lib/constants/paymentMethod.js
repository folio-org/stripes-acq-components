import React from 'react';
import { FormattedMessage } from 'react-intl';

export const PAYMENT_METHOD = {
  cash: 'Cash',
  card: 'Credit Card',
  eft: 'EFT',
  depAccount: 'Deposit Account',
  physicalCheck: 'Physical Check',
  bankDraft: 'Bank Draft',
  internalTransfer: 'Internal Transfer',
  other: 'Other',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.cash]: <FormattedMessage id="stripes-acq-components.paymentMethod.cash" />,
  [PAYMENT_METHOD.card]: <FormattedMessage id="stripes-acq-components.paymentMethod.card" />,
  [PAYMENT_METHOD.eft]: <FormattedMessage id="stripes-acq-components.paymentMethod.eft" />,
  [PAYMENT_METHOD.depAccount]: <FormattedMessage id="stripes-acq-components.paymentMethod.depAccount" />,
  [PAYMENT_METHOD.physicalCheck]: <FormattedMessage id="stripes-acq-components.paymentMethod.physicalCheck" />,
  [PAYMENT_METHOD.bankDraft]: <FormattedMessage id="stripes-acq-components.paymentMethod.bankDraft" />,
  [PAYMENT_METHOD.internalTransfer]: <FormattedMessage id="stripes-acq-components.paymentMethod.internalTransfer" />,
  [PAYMENT_METHOD.other]: <FormattedMessage id="stripes-acq-components.paymentMethod.other" />,
};

export const PAYMENT_METHOD_LABELS_ID = {
  [PAYMENT_METHOD.cash]: 'stripes-acq-components.paymentMethod.cash',
  [PAYMENT_METHOD.card]: 'stripes-acq-components.paymentMethod.card',
  [PAYMENT_METHOD.eft]: 'stripes-acq-components.paymentMethod.eft',
  [PAYMENT_METHOD.depAccount]: 'stripes-acq-components.paymentMethod.depAccount',
  [PAYMENT_METHOD.physicalCheck]: 'stripes-acq-components.paymentMethod.physicalCheck',
  [PAYMENT_METHOD.bankDraft]: 'stripes-acq-components.paymentMethod.bankDraft',
  [PAYMENT_METHOD.internalTransfer]: 'stripes-acq-components.paymentMethod.internalTransfer',
  [PAYMENT_METHOD.other]: 'stripes-acq-components.paymentMethod.other',
};

export const PAYMENT_METHOD_OPTIONS = Object.values(PAYMENT_METHOD).map(method => ({
  value: method,
  labelId: PAYMENT_METHOD_LABELS_ID[method],
}));
