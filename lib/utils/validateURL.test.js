import { validateURL } from './validateURL';

test('validateURL', () => {
  expect(validateURL('some invalid URL')).toBeTruthy();
  expect(validateURL('https://folio-testing.dev.folio.org')).toBe(undefined);
  expect(validateURL(undefined)).toBe(undefined);
});
