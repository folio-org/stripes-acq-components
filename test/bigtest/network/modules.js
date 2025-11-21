import camelCase from 'lodash/camelCase';

export const buildMirageModules = context => (
  context.keys().reduce((acc, modulePath) => {
    const moduleParts = modulePath.split('/');
    const moduleType = moduleParts[1];
    const moduleName = moduleParts[2];

    if (moduleType === 'settings') return acc;

    if (moduleName && moduleName !== 'index.js') {
      const moduleKey = camelCase(moduleName.replace('.js', ''));

      return Object.assign(acc, {
        [moduleType]: {
          ...(acc[moduleType] || {}),
          [moduleKey]: context(modulePath).default,
        },
      });
    } else {
      return acc;
    }
  }, {})
);

export const acqMirageModules = buildMirageModules(require.context('./', true, /\.js$/));
