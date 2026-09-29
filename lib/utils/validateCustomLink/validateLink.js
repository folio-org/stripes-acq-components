import { FormattedMessage } from 'react-intl';

const TOKENS = ['UUID', 'HRID', 'indexTitle'];
const TOKEN_PATTERNS = /\{\{([^{}]*)\}\}/g;
const VALID_PROTOCOLS = /^https?:\/\//i;

export const validateLink = (item) => {
  const errors = {};

  if (!item.link) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkRequired" />;
  }

  if (item.link && !VALID_PROTOCOLS.test(item.link)) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkProtocol" />;
  }

  if (item.link && [...item.link.matchAll(TOKEN_PATTERNS)].some(match => !TOKENS.includes(match[1]))) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkParameter" />;
  }

  if (item?.link?.length > 1000) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkTooLong" />;
  }

  return errors;
};
