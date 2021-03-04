import React, { useContext, useCallback } from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import { CalloutContext } from '@folio/stripes/core';

// Deprecated, use `useShowCallout` instead
export const useShowToast = () => {
  const callout = useContext(CalloutContext);

  return useCallback(
    (messageId, messageType = 'success', values = {}) => {
      if (callout) {
        callout.sendCallout({
          message: <SafeHTMLMessage id={messageId} values={values} />,
          type: messageType,
        });
      }
    },
    [callout],
  );
};

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
export const useShowCallout = () => {
  const callout = useContext(CalloutContext);

  return useCallback(
    ({ message, messageId, type = 'success', values = {}, ...rest }) => {
      if (callout) {
        callout.sendCallout({
          timeout: type === 'error' ? 0 : undefined,
          ...rest,
          message: message || <SafeHTMLMessage id={messageId} values={values} />,
          type,
        });
      }
    },
    [callout],
  );
};
