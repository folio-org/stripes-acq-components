import PropTypes from 'prop-types';

export const organizationShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  code: PropTypes.string,
});

export const organizationsShape = PropTypes.arrayOf(organizationShape);
