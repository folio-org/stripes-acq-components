import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

// Deprecated, use `showCallout` instead
export function showToast(messageId, messageType = 'success', values = {}) {
  this.callout.current.sendCallout({
    message: <SafeHTMLMessage id={messageId} values={values} />,
    type: messageType,
  });
}
