import { FormattedMessage } from 'react-intl';

export const validateLinkText = (item) => {
  const errors = {};

  if (item?.linkText?.length > 40) {
    errors.linkText = <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextTooLong" />;
  }

  if (item?.linkText?.trim() === '') {
    errors.linkText = <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextBlank" />;
  }

  if (!item.linkText) {
    errors.linkText = <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextRequired" />;
  }

  return errors;
};
