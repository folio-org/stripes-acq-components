import { FormattedMessage } from 'react-intl';

export const validateName = (item) => {
  const errors = {};

  if (item?.name?.trim() === '') {
    errors.name = <FormattedMessage id="stripes-acq-components.validation.customLink.nameBlank" />;
  }

  if (item?.name?.length > 150) {
    errors.name = <FormattedMessage id="stripes-acq-components.validation.customLink.nameTooLong" />;
  }

  return errors;
};
