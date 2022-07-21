import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';

const ERROR_CODES = {
  incorrectFundDistributionTotal: 'incorrectFundDistributionTotal',
  cannotMixTypesForZeroPrice: 'cannotMixTypesForZeroPrice',
};

export const handleValidationErrorResponse = async (error, callback = noop) => {
  let errorResponse;

  try {
    errorResponse = await error?.response.json();
  } catch {
    errorResponse = error;
  }

  if (errorResponse.errors && errorResponse.errors.length) {
    const err = errorResponse.errors[0];
    const errorCode = err.code;

    switch (errorCode) {
      case ERROR_CODES.incorrectFundDistributionTotal: {
        const remainingAmountValue = err.parameters?.find(({ key }) => key === 'remainingAmount')?.value;

        callback(remainingAmountValue);

        return <FormattedMessage id="stripes-acq-components.validation.shouldBeEqualToTotalAmount" />;
      }
      case ERROR_CODES.cannotMixTypesForZeroPrice: {
        return <FormattedMessage id="stripes-acq-components.validation.cannotMixTypesForZeroPrice" />;
      }
      default: {
        return err.message;
      }
    }
  }

  return errorResponse;
};
