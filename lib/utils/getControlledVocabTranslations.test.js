import { getControlledVocabTranslations } from './getControlledVocabTranslations';

const rootTranslationKey = 'ui-orders.settings.poNumber.prefixes';

describe('getControlledVocabTranslations', () => {
  it('should return an object with translation keys for <ControlledVocab> based on passed root translation key', () => {
    const translations = getControlledVocabTranslations(rootTranslationKey);

    Object.values(translations).forEach((translation) => expect(translation.startsWith(rootTranslationKey)));
  });
});
