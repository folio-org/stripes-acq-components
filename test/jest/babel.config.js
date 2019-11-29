module.exports = {
  'presets': [
    ['env', {
      useBuiltIns: 'entry',
    }],
    'stage-2',
    'react',
  ],
  'plugins': [
    'transform-decorators-legacy',
    ['transform-runtime', { polyfill: false }],
  ],
};
