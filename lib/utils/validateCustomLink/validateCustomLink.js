import { validateName } from './validateName';
import { validateLinkText } from './validateLinkText';
import { validateLink } from './validateLink';

export const validateCustomLink = (item) => {
  const nameErrors = validateName(item);
  const linkTextErrors = validateLinkText(item);
  const linkErrors = validateLink(item);

  return {
    ...linkErrors,
    ...linkTextErrors,
    ...nameErrors,
  };
};
