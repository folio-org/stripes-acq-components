import React, { useContext, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { CalloutContext } from '@folio/stripes/core';

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
          message: message || <FormattedMessage id={messageId} values={values} />,
          type,
        });
      }
    },
    [callout],
  );
};
