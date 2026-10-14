import { FormattedMessage } from 'react-intl';

const TOKENS = new Set(['UUID', 'HRID', 'indexTitle']);
const TOKEN_PATTERNS = /\{\{([^{}]*)\}\}/g;
const VALID_PROTOCOLS = /^https?:\/\//i;
const LINK_MAX_LENGTH = 1000;

const hasValidTokenSyntax = (url) => !/[{}]/.test(url.replace(TOKEN_PATTERNS, '_'));

// Link must exist, has a wildly long max length, must start with http(s), must contain
// one or more TOKENS if the pattern {{...}} is present, and cannot use curly brackets
// in any other way. The backend more fully validates links, this just catches the most
// likely cause of validity issues given the token syntax.
export const validateLink = (item) => {
  if (!item.link) {
    return { link: <FormattedMessage id="stripes-acq-components.validation.customLink.linkRequired" /> };
  }

  if (item?.link?.length > LINK_MAX_LENGTH) {
    return { link: <FormattedMessage id="stripes-acq-components.validation.customLink.linkTooLong" values={{ max: LINK_MAX_LENGTH }} /> };
  }

  if (item.link && !VALID_PROTOCOLS.test(item.link)) {
    return { link: <FormattedMessage id="stripes-acq-components.validation.customLink.linkProtocol" /> };
  }

  if (item.link && [...item.link.matchAll(TOKEN_PATTERNS)].some(match => !TOKENS.has(match[1]))) {
    return { link: <FormattedMessage id="stripes-acq-components.validation.customLink.linkParameter" /> };
  }

  if (item.link && !hasValidTokenSyntax(item.link)) {
    return { link: <FormattedMessage id="stripes-acq-components.validation.customLink.linkInvalid" /> };
  }

  return {};
};
