// mimics the StripesTranslationPlugin in @folio/stripes-core
const prefixKeys = (translations, translationPrefix) => {
  const reducer = (acc, [key, value]) => {
    acc[`${translationPrefix}.${key}`] = value;

    return acc;
  };

  return Object.entries(translations).reduce(reducer, {});
};

export default prefixKeys;
