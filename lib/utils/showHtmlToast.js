import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

// eslint-disable-next-line import/prefer-default-export
export function showHtmlToast(messageId, config = { messageType: 'success' }) {
  this.callout.current.sendCallout({
    message: <SafeHTMLMessage id={messageId} values={config.values || {}} />,
    type: config.messageType,
  });
}
