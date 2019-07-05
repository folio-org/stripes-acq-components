import PropTypes from 'prop-types';

export const selectOptionShape = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.string,
});

export const selectOptionsShape = PropTypes.arrayOf(selectOptionShape);
