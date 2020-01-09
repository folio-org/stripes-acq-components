import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

// Deprecated, use `showCallout` instead
export function showToast(messageId, messageType = 'success', values = {}) {
  this.callout.current.sendCallout({
    message: <SafeHTMLMessage id={messageId} values={values} />,
    type: messageType,
  });
}

// Example of usage of callout with error and default message:
// const message = (
//   <FormattedMessage
//     id={`ui-finance.fund.actions.save.error.${errorCode}`}
//     defaultMessage={intl.formatMessage({ id: `ui-finance.fund.actions.save.error.${ERROR_CODE_GENERIC}` })}
//   />
// );

// showCallout({
//   message,
//   type: 'error',
// });

export function showCallout({ message, messageId, type = 'success', values = {} }) {
  this.callout.current.sendCallout({
    message: message || <SafeHTMLMessage id={messageId} values={values} />,
    type,
  });
}
