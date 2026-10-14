import { FormattedMessage } from 'react-intl';

// Link text must exist, must not be blank, and has a max length.
export const validateLinkText = (item) => {
  if (!item.linkText) {
    return { linkText: <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextRequired" /> };
  }

  if (item?.linkText?.trim() === '') {
    return { linkText: <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextBlank" /> };
  }

  if (item?.linkText?.length > 40) {
    return { linkText: <FormattedMessage id="stripes-acq-components.validation.customLink.linkTextTooLong" /> };
  }

  return {};
};
