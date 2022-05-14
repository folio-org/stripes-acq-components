import PropTypes from 'prop-types';

export const fieldSelectOptionShape = PropTypes.shape({
  disabled: PropTypes.bool,
  label: PropTypes.string,
  labelId: PropTypes.string,  // used for translation, rather than displaying directly like `label`.
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
});

export const fieldSelectOptionsShape = PropTypes.arrayOf(fieldSelectOptionShape);
