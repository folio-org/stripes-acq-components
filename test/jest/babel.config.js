module.exports = {
  'presets': [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
    }],
    '@babel/preset-react',
  ],
  'plugins': [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-proposal-decorators',
      { decoratorsBeforeExport: true },
    ],
    '@babel/plugin-transform-runtime',
  ],
};
