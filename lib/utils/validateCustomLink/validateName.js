import { FormattedMessage } from 'react-intl';

// Name is partly covered by ControlledVocab handling of the primary key field.
// This adds checks for blanks and max length.
export const validateName = (item) => {
  if (item?.name?.length > 150) {
    return { name: <FormattedMessage id="stripes-acq-components.validation.customLink.nameTooLong" /> };
  }

  if (item?.name?.trim() === '') {
    return { name: <FormattedMessage id="stripes-acq-components.validation.customLink.nameBlank" /> };
  }

  return {};
};
