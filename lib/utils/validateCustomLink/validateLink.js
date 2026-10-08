import { FormattedMessage } from 'react-intl';

const TOKENS = new Set(['UUID', 'HRID', 'indexTitle']);
const TOKEN_PATTERNS = /\{\{([^{}]*)\}\}/g;
const VALID_PROTOCOLS = /^https?:\/\//i;

const hasValidTokenSyntax = (url) => !/[{}]/.test(url.replace(TOKEN_PATTERNS, '_'));

export const validateLink = (item) => {
  const errors = {};

  if (!item.link) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkRequired" />;
  }

  if (item.link && !hasValidTokenSyntax(item.link)) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkInvalid" />;
  }

  if (item.link && [...item.link.matchAll(TOKEN_PATTERNS)].some(match => !TOKENS.has(match[1]))) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkParameter" />;
  }

  if (item.link && !VALID_PROTOCOLS.test(item.link)) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkProtocol" />;
  }

  if (item?.link?.length > 1000) {
    errors.link = <FormattedMessage id="stripes-acq-components.validation.customLink.linkTooLong" />;
  }

  return errors;
};
