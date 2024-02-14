import PropTypes from 'prop-types';

const styles = {
  display: 'none',
};

export const IfVisible = ({ children, visible = true }) => (
  visible
    ? children
    : <div style={styles}>{children}</div>
);

IfVisible.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
};
