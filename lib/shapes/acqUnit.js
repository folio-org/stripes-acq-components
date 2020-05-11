import PropTypes from 'prop-types';

export const acqUnitShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

export const acqUnitsShape = PropTypes.arrayOf(acqUnitShape);
