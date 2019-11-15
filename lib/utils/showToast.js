import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

export function showToast(messageId, messageType = 'success', values = {}) {
  this.callout.current.sendCallout({
    message: <SafeHTMLMessage id={messageId} values={values} />,
    type: messageType,
  });
}

export function showCallout({ message, messageId, type = 'success', values = {} }) {
  this.callout.current.sendCallout({
    message: message || <SafeHTMLMessage id={messageId} values={values} />,
    type,
  });
}
